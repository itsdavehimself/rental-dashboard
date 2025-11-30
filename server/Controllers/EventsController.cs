using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.DTOs.Event;
using server.Migrations;
using server.Models.Event;
using server.DTOs;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class EventsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;

  public EventsController(AppDbContext context, IConfiguration config, IMapper mapper)
  {
    _context = context;
    _config = config;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<IActionResult> GetEvents([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
  {
    var query = _context.Events
      .Include(e => e.Payments).ThenInclude(p => p.CollectedBy)
      .Include(e => e.LogisticsTasks)
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
      LogisticsTasks = e.LogisticsTasks.Select(l => new LogisticsTaskResponseDto
      {
        Uid = l.Uid,
        Type = l.Type,
        StartTime = l.StartTime,
        EndTime = l.EndTime,
        CrewLead = $"{l.CrewLead?.FirstName} {l.CrewLead?.LastName}".Trim(),
        Notes = l.Notes
      }).ToList(),
      Items = e.Items.Select(i => new EventItemResponseDto
      {
        Uid = i.Uid,
        Description = i.InventoryItem?.Description ?? "",
        InventoryItemUid = i.InventoryItem?.Uid,
        UnitPrice = i.UnitPrice,
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
      Payments = e.Payments.Select(p => new PaymentResponseDto
      {
        Uid = p.Uid,
        Amount = p.Amount,
        Method = p.Method,
        ReceivedAt = p.ReceivedAt,
        TransactionId = p.TransactionId ?? "",
        Refunded = p.Refunded,
        RefundedAmount = p.RefundedAmount,
        RefundedAt = p.RefundedAt,
        RefundReason = p.RefundReason
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
      .Include(e => e.Payments).ThenInclude(p => p.CollectedBy)
      .Include(e => e.LogisticsTasks)
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
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    return Ok(_mapper.Map<EventResponseDto>(eventObject));
  }

  [HttpPost("save-draft")]
  public async Task<IActionResult> CreateEvent(CreateEventDto request)
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
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var billingDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.BillingAddress);
    var deliveryDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.DeliveryAddress);

    if (billingDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Billing address not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    if (deliveryDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Delivery address not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    var localDeliveryDateTime = DateTime.SpecifyKind(
        request.DeliveryDate.Date.Add(DateTime.Parse(request.DeliveryTime).TimeOfDay),
        DateTimeKind.Unspecified
    );

    var centralZone = TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");
    var deliveryDateTime = TimeZoneInfo.ConvertTimeToUtc(localDeliveryDateTime, centralZone);

    var localPickupDateTime = DateTime.SpecifyKind(
        request.PickUpDate.Date.Add(DateTime.Parse(request.PickUpTime).TimeOfDay),
        DateTimeKind.Unspecified
    );

    var pickupDateTime = TimeZoneInfo.ConvertTimeToUtc(localPickupDateTime, centralZone);

    var newEvent = new Event
    {
      ClientId = client.Id,
      ClientUid = client.Uid,
      ClientFirstName = client.FirstName,
      ClientLastName = client.LastName,
      ClientPhone = client.PhoneNumber,
      ClientEmail = client.Email ?? "",
      EventName = request.EventName,
      EventStart = deliveryDateTime,
      EventEnd = pickupDateTime,
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
      LogisticsTasks = [],
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    _context.Events.Add(newEvent);
    await _context.SaveChangesAsync();

    var itemList = new List<EventItem>();

    foreach (var item in request.Items)
    {
      var inventory = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == item.InventoryItemUid);
      // var package = _context.Packages.FirstOrDefaultAsync(p => p.Uid == item.PackageUid);

      if (inventory == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Not Found",
          Detail = "Iventory item not found.",
          Status = StatusCodes.Status404NotFound
        })
        {
          StatusCode = StatusCodes.Status404NotFound
        };

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

  [HttpPatch("save-draft/{uid}")]
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
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == request.ClientUid);

    if (client == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }
    
    var billingDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.BillingAddress);
    var deliveryDetails = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == request.DeliveryAddress);

    if (billingDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Billing address not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    if (deliveryDetails == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Delivery address not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    var localDeliveryDateTime = DateTime.SpecifyKind(
        request.DeliveryDate.Date.Add(DateTime.Parse(request.DeliveryTime).TimeOfDay),
        DateTimeKind.Unspecified
    );

    var centralZone = TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");
    var deliveryDateTime = TimeZoneInfo.ConvertTimeToUtc(localDeliveryDateTime, centralZone);

    var localPickupDateTime = DateTime.SpecifyKind(
        request.PickUpDate.Date.Add(DateTime.Parse(request.PickUpTime).TimeOfDay),
        DateTimeKind.Unspecified
    );

    var pickupDateTime = TimeZoneInfo.ConvertTimeToUtc(localPickupDateTime, centralZone);

    eventDraft.ClientId = client.Id;
    eventDraft.ClientUid = client.Uid;
    eventDraft.ClientFirstName = client.FirstName;
    eventDraft.ClientLastName = client.LastName;
    eventDraft.ClientPhone = client.PhoneNumber;
    eventDraft.ClientEmail = client.Email ?? "";
    eventDraft.EventName = request.EventName;
    eventDraft.EventStart = deliveryDateTime;
    eventDraft.EventEnd = pickupDateTime;
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
    eventDraft.LogisticsTasks.Clear();
    eventDraft.UpdatedAt = DateTime.UtcNow;

    var oldItems = await _context.EventItems
      .Where(ei => ei.EventId == eventDraft.Id)
      .ToListAsync();

    _context.EventItems.RemoveRange(oldItems);

    var itemList = new List<EventItem>();

    foreach (var item in request.Items)
    {
      var inventory = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == item.InventoryItemUid);
      // var package = _context.Packages.FirstOrDefaultAsync(p => p.Uid == item.PackageUid);

      if (inventory == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Not Found",
          Detail = "Iventory item not found.",
          Status = StatusCodes.Status404NotFound
        })
        {
          StatusCode = StatusCodes.Status404NotFound
        };

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

  [HttpPost("{uid}/payment")]
  public async Task<IActionResult> CreatePayment(PaymentDto request, Guid uid)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var eventRecord = await _context.Events.FirstOrDefaultAsync(e => e.Uid == uid);

    if (eventRecord == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == request.CollectedByUid);

    if (user == null)
     {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    PaymentMethod paymentMethod;

    if (Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var method))
    {
      paymentMethod = method;
    }
    else
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad request",
        Detail = "Not a valid payment method.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };  
    }

    var newPayment = new Payment
    {
      EventId = eventRecord.Id,
      Amount = request.Amount,
      Method = paymentMethod,
      ReceivedAt = DateTime.UtcNow,
      TransactionId = request.TransactionId ?? null,
      CollectedById = user.Id,
      Notes = request.Notes
    };

    _context.Payments.Add(newPayment);
    await _context.SaveChangesAsync();

    return Ok(_mapper.Map<PaymentResponseDto>(newPayment));
  }
}