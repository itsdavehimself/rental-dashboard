using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.DTOs.Event;
using server.Models.Event;
using server.DTOs;
using Stripe;
using Amazon.S3;
using Amazon.S3.Model;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;
  private readonly IAmazonS3 _s3;

  public EventsController(AppDbContext context, IConfiguration config, IMapper mapper, IAmazonS3 s3)
  {
    _context = context;
    _config = config;
    _mapper = mapper;
    _s3 = s3;
  }

  [HttpGet]
  public async Task<IActionResult> GetEvents([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
  {
    var query = _context.Events
      .Include(e => e.Transactions).ThenInclude(p => p.ProcessedBy)
      .Include(e => e.LogisticsWorkItems) // Included WorkItems instead of Trips
          .ThenInclude(w => w.LogisticsTrip)
              .ThenInclude(t => t.Crew)
                  .ThenInclude(c => c.User)
      .Include(e => e.Items).ThenInclude(i => i.InventoryItem)
      .Include(e => e.Items).ThenInclude(i => i.Package)
      .Include(e => e.Discounts)
      .AsQueryable();

    var totalCount = await query.CountAsync();

    var results = await query
      .OrderBy(e => e.EventStart)
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToListAsync();

    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var clientIds = results.Select(e => e.ClientId).Distinct().ToList();

    var clientUids = await _context.Clients
      .Where(c => clientIds.Contains(c.Id))
      .ToDictionaryAsync(c => c.Id, c => c.Uid);

    var dtos = results.Select(e => new EventResponseDto
    {
      Uid = e.Uid,
      ClientFirstName = e.ClientFirstName,
      ClientLastName = e.ClientLastName,
      BusinessName = e.BusinessName,
      ClientPhone = e.ClientPhone,
      ClientEmail = e.ClientEmail,
      EventName = e.EventName,
      EventStart = e.EventStart,
      EventEnd = e.EventEnd,
      BillingFirstName = e.BillingFirstName,
      BillingLastName = e.BillingLastName,
      BillingAddressLine1 = e.BillingAddressLine1,
      BillingAddressLine2 = e.BillingAddressLine2,
      BillingCity = e.BillingCity,
      BillingState = e.BillingState,
      BillingZipCode = e.BillingZipCode,
      BillingPhone = e.BillingPhone,
      BillingEmail = e.BillingEmail,
      DeliveryFirstName = e.DeliveryFirstName,
      DeliveryLastName = e.DeliveryLastName,
      DeliveryAddressLine1 = e.DeliveryAddressLine1,
      DeliveryAddressLine2 = e.DeliveryAddressLine2,
      DeliveryCity = e.DeliveryCity,
      DeliveryState = e.DeliveryState,
      DeliveryZipCode = e.DeliveryZipCode,
      DeliveryPhone = e.DeliveryPhone,
      DeliveryEmail = e.DeliveryEmail,
      Status = e.Status,
      Notes = e.Notes,
      InternalNotes = e.InternalNotes,
      
      // Select the unique trips attached to this event's work items
      LogisticsTrips = e.LogisticsWorkItems
          .Select(w => w.LogisticsTrip)
          .Where(l => l != null)
          .Distinct()
          .Select(l => new LogisticsTripResponseDto
          {
            Uid = l.Uid,
            Status = l.Status.ToString(),
            ScheduledStart = l.ScheduledStart,
            ScheduledEnd = l.ScheduledEnd,
            ActualArrival = l.ActualArrival,
            ActualStart = l.ActualStart,
            CompletedAt = l.CompletedAt,
            Crew = l.Crew.Select(ca => new LogisticsAssignmentResponseDto
                {
                    Uid = ca.Uid,
                    UserUid = ca.User.Uid,
                    FullName = $"{ca.User.FirstName} {ca.User.LastName}".Trim(),
                    IsLead = ca.IsLead,
                    RoleNotes = ca.RoleNotes,
                }).ToList(),
          }).ToList(),
          
      Items = e.Items.Select(i => new EventItemResponseDto
      {
        Uid = i.Uid,
        Description = i.InventoryItem?.Description ?? "",
        InventoryItemUid = i.InventoryItem?.Uid,
        UnitPrice = i.UnitPrice,
        ImageUrl = GetInventoryImageUrl(i.InventoryItem?.ImageUrl),
        Type = i.Type,
        PackageUid = i.Package?.Uid,
        Quantity = i.Quantity,
        CreatedAt = i.CreatedAt,
        UpdatedAt = i.UpdatedAt
      }).ToList(),
      Subtotal = e.Subtotal,
      TaxAmount = e.TaxAmount,
      Discounts = e.Discounts.Select(d => new DiscountResponseDto
      {
        Uid = d.Uid,
        Type = d.Type,
        Amount = d.Amount,
        Reason = d.Reason,
        CreatedAt = d.CreatedAt,
        UpdatedAt = d.UpdatedAt
      }).ToList(),
      Total = e.Total,
      Transactions = e.Transactions.Select(p => new TransactionResponseDto
      {
        Uid = p.Uid,
        Amount = p.Amount,
        Method = p.Method,
        OccurredAt = p.OccurredAt,
        ExternalTransactionId = p.ExternalTransactionId ?? "",
      }).ToList(),
      CreatedAt = e.CreatedAt,
      UpdatedAt = e.UpdatedAt,
      ClientUid = clientUids.ContainsKey(e.ClientId)
        ? clientUids[e.ClientId]
        : Guid.Empty
    }).ToList();

    return Ok(new PaginatedResponse<EventResponseDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = dtos
    });
  }

  [HttpGet("{uid}")]
  public async Task<IActionResult> GetEvent(Guid uid)
  {
    var eventObject = await _context.Events
      .Include(e => e.Transactions).ThenInclude(p => p.ProcessedBy)
      
      // Swapped Trip routing to WorkItem routing
      .Include(e => e.LogisticsWorkItems).ThenInclude(w => w.LogisticsTrip).ThenInclude(l => l.Crew).ThenInclude(a => a.User)
      .Include(e => e.LogisticsWorkItems).ThenInclude(w => w.LogisticsTrip).ThenInclude(l => l.WorkItems)
      .Include(e => e.LogisticsWorkItems).ThenInclude(w => w.LogisticsTrip).ThenInclude(l => l.Truck)
      
      .Include(e => e.Items).ThenInclude(i => i.InventoryItem)
      .Include(e => e.Items).ThenInclude(i => i.Package)
      .Include(e => e.Discounts).FirstOrDefaultAsync(e => e.Uid == uid);

    if (eventObject == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var dto = _mapper.Map<EventResponseDto>(eventObject);
    
    // Safely attach the trips back onto the mapped DTO to prevent missing lists
    dto.LogisticsTrips = eventObject.LogisticsWorkItems
        .Select(w => w.LogisticsTrip)
        .Where(l => l != null)
        .Distinct()
        .Select(l => _mapper.Map<LogisticsTripResponseDto>(l))
        .ToList();

    foreach (var dtoItem in dto.Items)
    {
        var sourceItem = eventObject.Items.FirstOrDefault(i => i.Uid == dtoItem.Uid);

        dtoItem.ImageUrl = GetInventoryImageUrl(sourceItem?.InventoryItem?.ImageUrl);
    }

    var cardPayments = dto.Transactions
      .Where(t => t.Method == PaymentMethod.Card && t.ExternalTransactionId != null)
      .ToList();

    var chargeService = new ChargeService();

    await Task.WhenAll(cardPayments.Select(async t =>
    {
      var charges = await chargeService.ListAsync(new ChargeListOptions
      {
        PaymentIntent = t.ExternalTransactionId,
        Limit = 5
      });

      var charge = charges.Data
        .FirstOrDefault(c => c.Status == "succeeded");

      var card = charge?
        .PaymentMethodDetails?
        .Card;

      if (card == null)
        return;

      t.CardBrand = card.Brand;
      t.Last4 = card.Last4;
    }));

    return Ok(dto);
  }

  [HttpPost("save-draft")]
  public async Task<IActionResult> CreateEventDraft(CreateEventDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == request.ClientUid);

    if (client == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Client not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var billingDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.BillingAddress);
    var deliveryDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.DeliveryAddress);

    if (billingDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Billing address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    if (deliveryDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Delivery address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    var newEvent = new Models.Event.Event
    {
      ClientId = client.Id,
      ClientUid = client.Uid,
      ClientFirstName = client.FirstName,
      ClientLastName = client.LastName,
      ClientPhone = client.PhoneNumber,
      ClientEmail = client.Email ?? "",
      EventName = request.EventName,
      EventStart = request.EventStart,
      EventEnd = request.EventEnd,
      BillingAddressEntryUid = billingDetails.Uid,
      BillingFirstName = billingDetails.FirstName,
      BillingLastName =  billingDetails.LastName,
      BillingAddressLine1 = billingDetails.AddressLine1,
      BillingAddressLine2 = billingDetails.AddressLine2,
      BillingCity = billingDetails.City,
      BillingState = billingDetails.State,
      BillingZipCode = billingDetails.ZipCode,
      BillingPhone = billingDetails.PhoneNumber,
      BillingEmail = billingDetails.Email,
      DeliveryAddressEntryUid = deliveryDetails.Uid,
      DeliveryFirstName = deliveryDetails.FirstName,
      DeliveryLastName = deliveryDetails.LastName,
      DeliveryAddressLine1 = deliveryDetails.AddressLine1,
      DeliveryAddressLine2 = deliveryDetails.AddressLine2,
      DeliveryCity = deliveryDetails.City,
      DeliveryState = deliveryDetails.State,
      DeliveryZipCode = deliveryDetails.ZipCode,
      DeliveryPhone = deliveryDetails.PhoneNumber,
      DeliveryEmail = deliveryDetails.Email,
      Status = EventStatus.Draft,
      Notes = request.Notes,
      EventType = request.EventType,
      InternalNotes = request.InternalNotes,
      LogisticsWorkItems = [], // Changed from Trips to WorkItems
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    _context.Events.Add(newEvent);
    await _context.SaveChangesAsync();

    var itemList = new List<EventItem>();

    foreach (var item in request.Items)
    {
      var inventory = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == item.InventoryItemUid);

      if (inventory == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Not Found",
          Detail = "Iventory item not found.",
          Status = StatusCodes.Status404NotFound
        }) { StatusCode = StatusCodes.Status404NotFound };

      var eventItem = new EventItem
      {
        EventId = newEvent.Id,
        InventoryItemId = inventory.Id,
        Quantity = item.Quantity,
        UnitPrice = inventory.UnitPrice,
        Type = ItemType.AlaCarte,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
      };

      _context.EventItems.Add(eventItem);
      itemList.Add(eventItem);
    }

    await _context.SaveChangesAsync();

    var subtotal = await _context.EventItems
      .Where(ei => ei.EventId == newEvent.Id)
      .SumAsync(ei => ei.Quantity * ei.UnitPrice);

    var taxRate = await _context.TaxJurisdictions
      .Where(t => t.ZipCode == newEvent.DeliveryZipCode)
      .Select(t => t.HighRate)
      .FirstOrDefaultAsync();

    var taxAmount = subtotal * taxRate/100;

    newEvent.Subtotal = subtotal;
    newEvent.TaxAmount = taxAmount;
    newEvent.Total = subtotal + taxAmount;

    await _context.SaveChangesAsync();

    return Ok(new
    {
      uid = newEvent.Uid,
      status = newEvent.Status.ToString(),
      clientFirstName = newEvent.ClientFirstName,
      clientLastName = newEvent.ClientLastName,
      total = newEvent.Total
    });
  }

  [HttpPatch("update/{uid}")]
  public async Task<IActionResult> UpdateEventDraft(CreateEventDto request, Guid uid)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var eventDraft = await _context.Events.FirstOrDefaultAsync(e => e.Uid == uid);

    if (eventDraft == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event draft not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == request.ClientUid);

    if (client == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }
    
    var billingDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.BillingAddress);
    var deliveryDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.DeliveryAddress);

    if (billingDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Billing address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    if (deliveryDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Delivery address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    eventDraft.ClientId = client.Id;
    eventDraft.ClientUid = client.Uid;
    eventDraft.ClientFirstName = client.FirstName;
    eventDraft.ClientLastName = client.LastName;
    eventDraft.ClientPhone = client.PhoneNumber;
    eventDraft.ClientEmail = client.Email ?? "";
    eventDraft.EventName = request.EventName;
    eventDraft.EventStart = request.EventStart;
    eventDraft.EventEnd = request.EventEnd;
    eventDraft.BillingAddressEntryUid = request.BillingAddress;
    eventDraft.BillingFirstName = billingDetails.FirstName;
    eventDraft.BillingLastName =  billingDetails.LastName;
    eventDraft.BillingAddressLine1 = billingDetails.AddressLine1;
    eventDraft.BillingAddressLine2 = billingDetails.AddressLine2;
    eventDraft.BillingCity = billingDetails.City;
    eventDraft.BillingState = billingDetails.State;
    eventDraft.BillingZipCode = billingDetails.ZipCode;
    eventDraft.BillingPhone = billingDetails.PhoneNumber;
    eventDraft.BillingEmail = billingDetails.Email;
    eventDraft.DeliveryAddressEntryUid = request.DeliveryAddress;
    eventDraft.DeliveryFirstName = deliveryDetails.FirstName;
    eventDraft.DeliveryLastName = deliveryDetails.LastName;
    eventDraft.DeliveryAddressLine1 = deliveryDetails.AddressLine1;
    eventDraft.DeliveryAddressLine2 = deliveryDetails.AddressLine2;
    eventDraft.DeliveryCity = deliveryDetails.City;
    eventDraft.DeliveryState = deliveryDetails.State;
    eventDraft.DeliveryZipCode = deliveryDetails.ZipCode;
    eventDraft.DeliveryPhone = deliveryDetails.PhoneNumber;
    eventDraft.DeliveryEmail = deliveryDetails.Email;
    eventDraft.Notes = request.Notes;
    eventDraft.EventType = request.EventType;
    eventDraft.InternalNotes = request.InternalNotes;
    eventDraft.UpdatedAt = DateTime.UtcNow;

    var oldItems = await _context.EventItems
      .Where(ei => ei.EventId == eventDraft.Id)
      .ToListAsync();

    _context.EventItems.RemoveRange(oldItems);

    var itemList = new List<EventItem>();

    foreach (var item in request.Items)
    {
      var inventory = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == item.InventoryItemUid);

      if (inventory == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Not Found",
          Detail = "Iventory item not found.",
          Status = StatusCodes.Status404NotFound
        }) { StatusCode = StatusCodes.Status404NotFound };

      var eventItem = new EventItem
      {
        EventId = eventDraft.Id,
        InventoryItemId = inventory.Id,
        Quantity = item.Quantity,
        UnitPrice = inventory.UnitPrice,
        Type = ItemType.AlaCarte,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
      };

      _context.EventItems.Add(eventItem);
      itemList.Add(eventItem);
    }

    await _context.SaveChangesAsync();

    var subtotal = await _context.EventItems
      .Where(ei => ei.EventId == eventDraft.Id)
      .SumAsync(ei => ei.Quantity * ei.UnitPrice);

    var taxRate = await _context.TaxJurisdictions
      .Where(t => t.ZipCode == eventDraft.DeliveryZipCode)
      .Select(t => t.HighRate)
      .FirstOrDefaultAsync();

    var taxAmount = subtotal * taxRate/100;

    eventDraft.Subtotal = subtotal;
    eventDraft.TaxAmount = taxAmount;
    eventDraft.Total = subtotal + taxAmount;

    await _context.SaveChangesAsync();

    return Ok(new
    {
      uid = eventDraft.Uid,
      status = eventDraft.Status.ToString(),
      clientFirstName = eventDraft.ClientFirstName,
      clientLastName = eventDraft.ClientLastName,
      total = eventDraft.Total
    });
  }

  [HttpPost("reserve")]
  public async Task<IActionResult> ReserveEvent(CreateEventDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var eventDraft = await _context.Events.FirstOrDefaultAsync(e => e.Uid == request.EventUid);

    if (eventDraft == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event draft not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == request.ClientUid);

    if (client == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Client not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var totalTransactionAmount = await _context.Transactions
      .Where(t => t.EventId == eventDraft.Id)
      .SumAsync(t => t.Amount);

    if (eventDraft.Total > 0 && (totalTransactionAmount / eventDraft.Total) < 0.2m && client.IsLegacy == false)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Cannot reserve event with less than 20% deposit.",
        Status = StatusCodes.Status400BadRequest
      }) { StatusCode = StatusCodes.Status400BadRequest };
    }

    var billingDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.BillingAddress);
    var deliveryDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.DeliveryAddress);

    if (billingDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Billing address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    if (deliveryDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Delivery address not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };

    eventDraft.ClientId = client.Id;
    eventDraft.ClientUid = client.Uid;
    eventDraft.ClientFirstName = client.FirstName;
    eventDraft.ClientLastName = client.LastName;
    eventDraft.ClientPhone = client.PhoneNumber;
    eventDraft.ClientEmail = client.Email ?? "";
    eventDraft.EventName = request.EventName;
    eventDraft.EventStart = request.EventStart;
    eventDraft.EventEnd = request.EventEnd;
    eventDraft.BillingAddressEntryUid = request.BillingAddress;
    eventDraft.BillingFirstName = billingDetails.FirstName;
    eventDraft.BillingLastName =  billingDetails.LastName;
    eventDraft.BillingAddressLine1 = billingDetails.AddressLine1;
    eventDraft.BillingAddressLine2 = billingDetails.AddressLine2;
    eventDraft.BillingCity = billingDetails.City;
    eventDraft.BillingState = billingDetails.State;
    eventDraft.BillingZipCode = billingDetails.ZipCode;
    eventDraft.BillingPhone = billingDetails.PhoneNumber;
    eventDraft.BillingEmail = billingDetails.Email;
    eventDraft.DeliveryAddressEntryUid = request.DeliveryAddress;
    eventDraft.DeliveryFirstName = deliveryDetails.FirstName;
    eventDraft.DeliveryLastName = deliveryDetails.LastName;
    eventDraft.DeliveryAddressLine1 = deliveryDetails.AddressLine1;
    eventDraft.DeliveryAddressLine2 = deliveryDetails.AddressLine2;
    eventDraft.DeliveryCity = deliveryDetails.City;
    eventDraft.DeliveryState = deliveryDetails.State;
    eventDraft.DeliveryZipCode = deliveryDetails.ZipCode;
    eventDraft.DeliveryPhone = deliveryDetails.PhoneNumber;
    eventDraft.DeliveryEmail = deliveryDetails.Email;
    eventDraft.Notes = request.Notes;
    eventDraft.EventType = request.EventType;
    eventDraft.InternalNotes = request.InternalNotes;
    eventDraft.UpdatedAt = DateTime.UtcNow;
    eventDraft.Status = EventStatus.Confirmed;

    var oldItems = await _context.EventItems
      .Where(ei => ei.EventId == eventDraft.Id)
      .ToListAsync();

    _context.EventItems.RemoveRange(oldItems);

    var itemList = new List<EventItem>();

    foreach (var item in request.Items)
    {
      var inventory = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == item.InventoryItemUid);

      if (inventory == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Not Found",
          Detail = "Iventory item not found.",
          Status = StatusCodes.Status404NotFound
        }) { StatusCode = StatusCodes.Status404NotFound };

      var eventItem = new EventItem
      {
        EventId = eventDraft.Id,
        InventoryItemId = inventory.Id,
        Quantity = item.Quantity,
        UnitPrice = inventory.UnitPrice,
        Type = ItemType.AlaCarte,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
      };

      _context.EventItems.Add(eventItem);
      itemList.Add(eventItem);
    }

    await _context.SaveChangesAsync();

    var subtotal = await _context.EventItems
      .Where(ei => ei.EventId == eventDraft.Id)
      .SumAsync(ei => ei.Quantity * ei.UnitPrice);

    var taxRate = await _context.TaxJurisdictions
      .Where(t => t.ZipCode == eventDraft.DeliveryZipCode)
      .Select(t => t.HighRate)
      .FirstOrDefaultAsync();

    var taxAmount = subtotal * taxRate/100;

    eventDraft.Subtotal = subtotal;
    eventDraft.TaxAmount = taxAmount;
    eventDraft.Total = subtotal + taxAmount;

    await _context.SaveChangesAsync();

    return Ok(new
    {
      uid = eventDraft.Uid,
      status = eventDraft.Status.ToString(),
      clientFirstName = eventDraft.ClientFirstName,
      clientLastName = eventDraft.ClientLastName,
      total = eventDraft.Total
    });
  }

  private async Task ReconcileLogisticsAfterEventCancelled(int eventId)
  {
      var affectedTrips = await _context.LogisticsTrips
          .Include(t => t.WorkItems)
          .Include(t => t.Crew)
          .Where(t => t.WorkItems.Any(w => w.EventId == eventId))
          .ToListAsync();

      foreach (var trip in affectedTrips)
      {
          var eventWorkItems = trip.WorkItems
              .Where(w => w.EventId == eventId)
              .ToList();

          if (!eventWorkItems.Any())
          {
              continue;
          }

          foreach (var workItem in eventWorkItems)
          {
              if (
                  trip.Status == TripStatus.Scheduled &&
                  workItem.Status == LogisticsWorkItemStatus.Pending
              )
              {
                  trip.WorkItems.Remove(workItem);
                  _context.LogisticsWorkItems.Remove(workItem);
                  continue;
              }

              if (workItem.Status != LogisticsWorkItemStatus.Completed)
              {
                  workItem.Status = LogisticsWorkItemStatus.Cancelled;
                  workItem.UpdatedAt = DateTime.UtcNow;
              }
          }

          var remainingWorkItems = trip.WorkItems
              .OrderBy(w => w.SortOrder)
              .ToList();

          var hasRemainingEventWork = remainingWorkItems
              .Any(w => w.EventId.HasValue);

          if (
              trip.Status == TripStatus.Scheduled &&
              !hasRemainingEventWork
          )
          {
              _context.LogisticsAssignments.RemoveRange(trip.Crew);
              _context.LogisticsWorkItems.RemoveRange(remainingWorkItems);
              _context.LogisticsTrips.Remove(trip);
              continue;
          }

          if (trip.Status == TripStatus.Scheduled)
          {
              for (var index = 0; index < remainingWorkItems.Count; index++)
              {
                  remainingWorkItems[index].SortOrder = index + 1;
                  remainingWorkItems[index].UpdatedAt = DateTime.UtcNow;
              }

              trip.UpdatedAt = DateTime.UtcNow;
          }
      }
  }

  [HttpPost("{status}/{uid}")]
  public async Task<IActionResult> ChangeEventStatus(string status, Guid uid)
  {
      var eventJob = await _context.Events.FirstOrDefaultAsync(e => e.Uid == uid);

      if (eventJob == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Event not found.",
              Status = StatusCodes.Status404NotFound
          }) { StatusCode = StatusCodes.Status404NotFound };
      }

      var isHoldRequest = status.Equals("onhold", StringComparison.OrdinalIgnoreCase);
      var isCancelRequest = status.Equals("cancelled", StringComparison.OrdinalIgnoreCase);

      if (!isHoldRequest && !isCancelRequest)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "Unsupported status transition. Use specific endpoints for Confirming or Scheduling.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      if (eventJob.Status != EventStatus.Confirmed && 
        eventJob.Status != EventStatus.Scheduled && 
        eventJob.Status != EventStatus.OnHold)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = $"Only Confirmed or Scheduled events can be moved to {status}.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      eventJob.Status = isHoldRequest ? EventStatus.OnHold : EventStatus.Cancelled;
      eventJob.UpdatedAt = DateTime.UtcNow;

      if (isCancelRequest)
      {
          await ReconcileLogisticsAfterEventCancelled(eventJob.Id);
      }

      await _context.SaveChangesAsync();

      return NoContent();
  }

  private string? GetInventoryImageUrl(string? imageKey)
  {
      if (string.IsNullOrWhiteSpace(imageKey))
      {
          return null;
      }

      var bucketName = _config["AWS:S3BucketName"];

      var request = new GetPreSignedUrlRequest
      {
          BucketName = bucketName,
          Key = imageKey,
          Expires = DateTime.UtcNow.AddHours(1)
      };

      return _s3.GetPreSignedURL(request);
  }
}