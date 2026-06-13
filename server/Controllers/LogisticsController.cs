using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.Models.Event;
using server.DTOs.Logistics;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LogisticsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;

  public LogisticsController(AppDbContext context, IConfiguration config, IMapper mapper)
  {
    _context = context;
    _config = config;
    _mapper = mapper;
  }

  [HttpGet("trucks")]
  public async Task<IActionResult> GetTrucks()
  {
    var trucks = await _context.Trucks
      .Include(t => t.Trips)
          .ThenInclude(tr => tr.WorkItems)
      .Include(t => t.Trips)
          .ThenInclude(tr => tr.Crew)
              .ThenInclude(a => a.User)
      .Where(t => t.IsActive)
      .ToListAsync();

    var response = _mapper.Map<List<TruckResponseDto>>(trucks);

    return Ok(response);
  }

  [HttpGet("trucks/{truckUid}/schedule/{date}")]
  public async Task<IActionResult> GetTruckSchedule(Guid truckUid, DateOnly date, [FromHeader(Name = "x-user-timezone")] string timezone)
  {
    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Uid == truckUid);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    if (timezone == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Timezone must be provided in header.",
        Status = StatusCodes.Status400BadRequest
      }) { StatusCode = StatusCodes.Status400BadRequest };
    }

    var tz = TimeZoneInfo.FindSystemTimeZoneById(timezone);
    var localStart = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);
    var localEnd = localStart.AddDays(1).AddTicks(-1);

    var utcStart = TimeZoneInfo.ConvertTimeToUtc(localStart, tz);
    var utcEnd = TimeZoneInfo.ConvertTimeToUtc(localEnd, tz);

    var trips = await _context.LogisticsTrips
      .Where(t => t.TruckId == truck.Id 
              && t.ScheduledStart >= utcStart 
              && t.ScheduledStart <= utcEnd)
      .Include(t => t.WorkItems)
          .ThenInclude(w => w.Event) // Route through WorkItems
      .Include(t => t.Crew)
          .ThenInclude(a => a.User)
      .OrderBy(t => t.ScheduledStart)
      .ToListAsync();

    var dto = _mapper.Map<List<LogisticsTripResponseDto>>(trips);

    return Ok(dto);
  }

[HttpGet("schedule/{date}")]
public async Task<IActionResult> GetDispatchSchedule(
    DateOnly date,
    [FromHeader(Name = "x-user-timezone")] string? timezone = null
)
{
    timezone ??= "America/Chicago";

    TimeZoneInfo tz;

    try
    {
        tz = TimeZoneInfo.FindSystemTimeZoneById(timezone);
    }
    catch (TimeZoneNotFoundException)
    {
        tz = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
    }
    catch (InvalidTimeZoneException)
    {
        tz = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
    }

    var localStart = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0);
    var localEnd = localStart.AddDays(1);

    var utcStart = TimeZoneInfo.ConvertTimeToUtc(localStart, tz);
    var utcEnd = TimeZoneInfo.ConvertTimeToUtc(localEnd, tz);

      var trips = await _context.LogisticsTrips
          .Where(t => t.ScheduledStart >= utcStart && t.ScheduledStart < utcEnd)
          .Include(t => t.Truck)
          .Include(t => t.Crew)
              .ThenInclude(a => a.User)
          .Include(t => t.WorkItems)
              .ThenInclude(w => w.Event)
          .OrderBy(t => t.ScheduledStart)
          .ToListAsync();

      return Ok(trips.Select(t => new
      {
          uid = t.Uid,
          name = t.Name,
          status = t.Status.ToString(),
          truckUid = t.Truck.Uid,
          truckName = t.Truck.Name,
          scheduledStart = t.ScheduledStart,
          scheduledEnd = t.ScheduledEnd,
          crew = t.Crew.Select(c => new
          {
              uid = c.Uid,
              userUid = c.User.Uid,
              fullName = $"{c.User.FirstName} {c.User.LastName}".Trim(),
              isLead = c.IsLead
          }),
          workItems = t.WorkItems
              .OrderBy(w => w.SortOrder)
              .Select(w => new
              {
                  uid = w.Uid,
                  sortOrder = w.SortOrder,
                  type = w.Type.ToString(),
                  status = w.Status.ToString(),
                  eventUid = w.Event?.Uid,
                  eventName = w.Event?.EventName,
                  location = w.Event == null
                      ? null
                      : $"{w.Event.DeliveryCity}, {w.Event.DeliveryState}",
                  specificNotes = w.SpecificNotes
              })
      }));
  }

  [HttpPost("trip")]
  public async Task<IActionResult> CreateTrip(LogisticsTripRequestDto request)
  {
    var eventJob = await _context.Events.FirstOrDefaultAsync(e => e.Uid == request.EventUid);
    
    if (eventJob == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Uid == request.TruckUid);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var crewLead = await _context.Users.FirstOrDefaultAsync(c => c.Uid == request.CrewLead);

    if (crewLead == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Lead user not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    if (request.Crew != null && request.Crew.Any())
    {
        var distinctCrewIds = request.Crew.Distinct().ToList();
        var validCrewCount = await _context.Users.CountAsync(u => distinctCrewIds.Contains(u.Uid));

        if (validCrewCount != distinctCrewIds.Count)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "One or more crew members do not exist.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }
    }

    var newTrip = new LogisticsTrip
    {
        Status = TripStatus.Scheduled,
        ScheduledStart = request.StartTime,
        ScheduledEnd = request.EndTime,
        TruckId = truck.Id,
        WorkItems = []
    };

    Dictionary<string, LogisticsWorkType[]> taskMap = new() 
    {
        ["Delivery/Setup"]  = [LogisticsWorkType.Delivery, LogisticsWorkType.Setup],
        ["Delivery"]        = [LogisticsWorkType.Delivery],
        ["Setup"]           = [LogisticsWorkType.Setup],
        ["Teardown/Pickup"] = [LogisticsWorkType.Teardown, LogisticsWorkType.Pickup],
        ["Teardown"]        = [LogisticsWorkType.Teardown],
        ["Pickup"]          = [LogisticsWorkType.Pickup]
    };

    if (taskMap.TryGetValue(request.TaskType ?? "", out var workTypes))
    {
        foreach (var type in workTypes)
        {
            newTrip.WorkItems.Add(new LogisticsWorkItem
            {
                EventId = eventJob.Id,
                Type = type,
                Status = LogisticsWorkItemStatus.Pending
            });
        }
    }

    _context.LogisticsTrips.Add(newTrip);

    var assignments = new List<LogisticsAssignment>
    {
        new LogisticsAssignment { UserId = crewLead.Id, IsLead = true }
    };

    if (request.Crew != null && request.Crew.Any())
    {
        var distinctCrewUids = request.Crew.Distinct().ToList();
        var crewMemberIds = await _context.Users
            .Where(u => distinctCrewUids.Contains(u.Uid))
            .Select(u => u.Id)
            .ToListAsync();

        foreach (var memberId in crewMemberIds)
        {
            if (memberId != crewLead.Id)
            {
                assignments.Add(new LogisticsAssignment { UserId = memberId, IsLead = false });
            }
        }
    }

    newTrip.Crew = assignments;  

    var allWorkTypes = await _context.LogisticsWorkItems
        .Where(wi => wi.EventId == eventJob.Id) // Filter directly by WorkItem EventId
        .Select(wi => wi.Type)
        .ToListAsync();

    allWorkTypes.AddRange(newTrip.WorkItems.Select(wi => wi.Type));

    var requiredTypes = new[] 
    { 
        LogisticsWorkType.Delivery, 
        LogisticsWorkType.Setup, 
        LogisticsWorkType.Teardown, 
        LogisticsWorkType.Pickup 
    };

    bool isFullyScheduled = requiredTypes.All(rt => allWorkTypes.Contains(rt));

    if (isFullyScheduled)
    {
        eventJob.Status = Models.Event.EventStatus.Scheduled;
        _context.Events.Update(eventJob);
    }

    await _context.SaveChangesAsync();

    var responseTrip = await _context.LogisticsTrips
    .Include(t => t.Truck)
    .Include(t => t.WorkItems)
    .Include(t => t.Crew)
        .ThenInclude(a => a.User)
    .FirstOrDefaultAsync(t => t.Id == newTrip.Id);

    var dto = _mapper.Map<LogisticsTripResponseDto>(responseTrip);

    return Ok(dto);
  }

  [HttpPatch("{uid}")]
  public async Task<IActionResult> UpdateTrip(Guid uid, LogisticsTripUpdateRequestDto request)
  {
    var trip = await _context.LogisticsTrips.FirstOrDefaultAsync(l => l.Uid == uid);

    if (trip == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Logistics trip not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Uid == request.TruckUid);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var crewLead = await _context.Users.FirstOrDefaultAsync(c => c.Uid == request.CrewLead);

    if (crewLead == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Lead user not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    if (request.Crew != null && request.Crew.Any())
    {
        var distinctCrewIds = request.Crew.Distinct().ToList();
        var validCrewCount = await _context.Users.CountAsync(u => distinctCrewIds.Contains(u.Uid));

        if (validCrewCount != distinctCrewIds.Count)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "One or more crew members do not exist.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }
    }

    trip.ScheduledStart = request.StartTime;
    trip.ScheduledEnd = request.EndTime;
    trip.TruckId = truck.Id;
    await _context.Entry(trip).Collection(t => t.Crew).LoadAsync();

    trip.Crew.Clear();

    var assignments = new List<LogisticsAssignment>
    {
        new LogisticsAssignment { UserId = crewLead.Id, IsLead = true }
    };

    if (request.Crew != null && request.Crew.Any())
    {
        var distinctCrewUids = request.Crew.Distinct().ToList();
        var crewMemberIds = await _context.Users
            .Where(u => distinctCrewUids.Contains(u.Uid))
            .Select(u => u.Id)
            .ToListAsync();

        foreach (var memberId in crewMemberIds)
        {
            if (memberId != crewLead.Id)
            {
                assignments.Add(new LogisticsAssignment { UserId = memberId, IsLead = false });
            }
        }
    }

    trip.Crew = assignments;
    await _context.SaveChangesAsync();

    var responseTrip = await _context.LogisticsTrips
        .Include(t => t.Truck)
        .Include(t => t.WorkItems)
        .Include(t => t.Crew)
            .ThenInclude(a => a.User)
        .FirstOrDefaultAsync(t => t.Id == trip.Id);

    var dto = _mapper.Map<LogisticsTripResponseDto>(responseTrip);

    return Ok(dto);
  }

  [HttpPost("split/{uid}")]
  public async Task<IActionResult> SplitTrip(Guid uid)
  {
    var trip = await _context.LogisticsTrips.FirstOrDefaultAsync(l => l.Uid == uid);

    if (trip == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Logistics trip not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == trip.TruckId);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    var newTrip = new LogisticsTrip
    {
      Status = trip.Status,
      ScheduledStart = trip.ScheduledStart,
      ScheduledEnd = trip.ScheduledEnd,
      InternalNotes = trip.InternalNotes,
      TruckId = trip.TruckId
    };

    _context.LogisticsTrips.Add(newTrip);
    await _context.SaveChangesAsync();

    var workItems = await _context.LogisticsWorkItems.Where(w => w.LogisticsTripId == trip.Id).ToListAsync();

    if (workItems.Count > 1) 
    {
        workItems[1].LogisticsTripId = newTrip.Id;
        await _context.SaveChangesAsync();
    }

    var workAssignments = await _context.LogisticsAssignments.Where(a => a.LogisticsTripId == trip.Id).ToListAsync();

    foreach (var assignment in workAssignments)
    {
      var newAssignment = new LogisticsAssignment
      {
        LogisticsTripId = newTrip.Id,
        UserId = assignment.UserId,
        IsLead = assignment.IsLead,
        RoleNotes = assignment.RoleNotes
      };

      _context.LogisticsAssignments.Add(newAssignment);
    }

    await _context.SaveChangesAsync();

    var originalTripUpdated = await _context.LogisticsTrips
    .Include(t => t.Truck).Include(t => t.WorkItems).Include(t => t.Crew).ThenInclude(a => a.User)
    .FirstOrDefaultAsync(t => t.Id == trip.Id);

    var newTripUpdated = await _context.LogisticsTrips
        .Include(t => t.Truck).Include(t => t.WorkItems).Include(t => t.Crew).ThenInclude(a => a.User)
        .FirstOrDefaultAsync(t => t.Id == newTrip.Id);

    return Ok(new { 
        original = _mapper.Map<LogisticsTripResponseDto>(originalTripUpdated), 
        split = _mapper.Map<LogisticsTripResponseDto>(newTripUpdated) 
    });
  }

  [HttpDelete("{uid}")]
  public async Task<IActionResult> DeleteTrip(Guid uid)
  {
    var trip = await _context.LogisticsTrips
        .Include(t => t.WorkItems)
        .FirstOrDefaultAsync(l => l.Uid == uid);

    if (trip == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Logistics trip not found.",
        Status = StatusCodes.Status404NotFound
      }) { StatusCode = StatusCodes.Status404NotFound };
    }

    // Since a trip can have multiple stops, find all events attached to this trip's work items
    var eventIds = trip.WorkItems.Where(w => w.EventId.HasValue).Select(w => w.EventId!.Value).Distinct().ToList();
    var eventJobs = await _context.Events.Where(e => eventIds.Contains(e.Id)).ToListAsync();

    foreach(var eJob in eventJobs)
    {
        eJob.Status = Models.Event.EventStatus.Confirmed;
    }

    _context.LogisticsTrips.Remove(trip);
    await _context.SaveChangesAsync();

    return NoContent();
  }

  [HttpPost("trips/manifest")]
  public async Task<IActionResult> CreateManifestTrip(CreateManifestTripRequestDto request)
  {
      if (string.IsNullOrWhiteSpace(request.Name))
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "Run name is required.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      if (request.ScheduledEnd <= request.ScheduledStart)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "Scheduled end must be after scheduled start.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      if (!request.WorkItems.Any())
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "At least one manifest item is required.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      var truck = await _context.Trucks
          .FirstOrDefaultAsync(t => t.Uid == request.TruckUid);

      if (truck == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Truck not found.",
              Status = StatusCodes.Status404NotFound
          }) { StatusCode = StatusCodes.Status404NotFound };
      }

      var crewLead = await _context.Users
          .FirstOrDefaultAsync(u => u.Uid == request.CrewLeadUid);

      if (crewLead == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Crew lead not found.",
              Status = StatusCodes.Status404NotFound
          }) { StatusCode = StatusCodes.Status404NotFound };
      }

      var crewUids = request.CrewUids
          .Append(request.CrewLeadUid)
          .Distinct()
          .ToList();

      var users = await _context.Users
          .Where(u => crewUids.Contains(u.Uid))
          .ToListAsync();

      if (users.Count != crewUids.Count)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "One or more crew members do not exist.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      var eventWorkTypes = new[]
      {
          LogisticsWorkType.Delivery,
          LogisticsWorkType.Setup,
          LogisticsWorkType.Teardown,
          LogisticsWorkType.Pickup
      };

      foreach (var item in request.WorkItems)
      {
          var requiresEvent = eventWorkTypes.Contains(item.Type);

          if (requiresEvent && item.EventUid == null)
          {
              return new ObjectResult(new ProblemDetails
              {
                  Title = "Bad Request",
                  Detail = $"{item.Type} requires an event.",
                  Status = StatusCodes.Status400BadRequest
              }) { StatusCode = StatusCodes.Status400BadRequest };
          }

          if (!requiresEvent && item.EventUid != null)
          {
              return new ObjectResult(new ProblemDetails
              {
                  Title = "Bad Request",
                  Detail = $"{item.Type} should not be attached to an event.",
                  Status = StatusCodes.Status400BadRequest
              }) { StatusCode = StatusCodes.Status400BadRequest };
          }
      }

      var eventUids = request.WorkItems
          .Where(w => w.EventUid.HasValue)
          .Select(w => w.EventUid!.Value)
          .Distinct()
          .ToList();

      var events = await _context.Events
          .Where(e => eventUids.Contains(e.Uid))
          .ToListAsync();

      if (events.Count != eventUids.Count)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "One or more events do not exist.",
              Status = StatusCodes.Status400BadRequest
          }) { StatusCode = StatusCodes.Status400BadRequest };
      }

      var eventsByUid = events.ToDictionary(e => e.Uid, e => e);

      var trip = new LogisticsTrip
      {
          Name = request.Name.Trim(),
          TruckId = truck.Id,
          ScheduledStart = request.ScheduledStart,
          ScheduledEnd = request.ScheduledEnd,
          InternalNotes = request.InternalNotes,
          Status = TripStatus.Scheduled,
          CreatedAt = DateTime.UtcNow,
          UpdatedAt = DateTime.UtcNow,
          WorkItems = request.WorkItems
              .OrderBy(w => w.SortOrder)
              .Select((w, index) => new LogisticsWorkItem
              {
                  SortOrder = index + 1,
                  Type = w.Type,
                  EventId = w.EventUid.HasValue ? eventsByUid[w.EventUid.Value].Id : null,
                  SpecificNotes = w.SpecificNotes,
                  Status = LogisticsWorkItemStatus.Pending,
                  CreatedAt = DateTime.UtcNow,
                  UpdatedAt = DateTime.UtcNow
              })
              .ToList(),
          Crew = users.Select(u => new LogisticsAssignment
          {
              UserId = u.Id,
              IsLead = u.Id == crewLead.Id,
              CreatedAt = DateTime.UtcNow,
              UpdatedAt = DateTime.UtcNow
          }).ToList()
      };

      _context.LogisticsTrips.Add(trip);

      foreach (var eventJob in events)
      {
          eventJob.Status = EventStatus.Scheduled;
          eventJob.UpdatedAt = DateTime.UtcNow;
      }

      await _context.SaveChangesAsync();

      return Ok(new
      {
          uid = trip.Uid,
          name = trip.Name,
          status = trip.Status.ToString(),
          truckUid = truck.Uid,
          truckName = truck.Name,
          scheduledStart = trip.ScheduledStart,
          scheduledEnd = trip.ScheduledEnd,
          crew = trip.Crew.Select(c => new
          {
              uid = c.Uid,
              userUid = users.First(u => u.Id == c.UserId).Uid,
              fullName = $"{users.First(u => u.Id == c.UserId).FirstName} {users.First(u => u.Id == c.UserId).LastName}".Trim(),
              isLead = c.IsLead
          }),
          workItems = trip.WorkItems
              .OrderBy(w => w.SortOrder)
              .Select(w => new
              {
                  uid = w.Uid,
                  sortOrder = w.SortOrder,
                  type = w.Type.ToString(),
                  status = w.Status.ToString(),
                  eventUid = w.EventId.HasValue
                      ? events.FirstOrDefault(e => e.Id == w.EventId.Value)?.Uid
                      : null,
                  eventName = w.EventId.HasValue
                      ? events.FirstOrDefault(e => e.Id == w.EventId.Value)?.EventName
                      : null,
                  specificNotes = w.SpecificNotes
              })
      });
  }

  [HttpPatch("trips/manifest/{tripUid}")]
    public async Task<IActionResult> UpdateManifestTrip(
        Guid tripUid,
        CreateManifestTripRequestDto request
    )
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Run name is required.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        if (request.ScheduledEnd <= request.ScheduledStart)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Scheduled end must be after scheduled start.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        if (!request.WorkItems.Any())
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "At least one manifest item is required.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var trip = await _context.LogisticsTrips
            .Include(t => t.WorkItems)
            .Include(t => t.Crew)
            .FirstOrDefaultAsync(t => t.Uid == tripUid);

        if (trip == null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Truck run not found.",
                Status = StatusCodes.Status404NotFound
            }) { StatusCode = StatusCodes.Status404NotFound };
        }

        if (trip.Status != TripStatus.Scheduled)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Only scheduled runs can be edited.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var truck = await _context.Trucks
            .FirstOrDefaultAsync(t => t.Uid == request.TruckUid);

        if (truck == null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Truck not found.",
                Status = StatusCodes.Status404NotFound
            }) { StatusCode = StatusCodes.Status404NotFound };
        }

        var crewLead = await _context.Users
            .FirstOrDefaultAsync(u => u.Uid == request.CrewLeadUid);

        if (crewLead == null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Crew lead not found.",
                Status = StatusCodes.Status404NotFound
            }) { StatusCode = StatusCodes.Status404NotFound };
        }

        var crewUids = request.CrewUids
            .Append(request.CrewLeadUid)
            .Distinct()
            .ToList();

        var users = await _context.Users
            .Where(u => crewUids.Contains(u.Uid))
            .ToListAsync();

        if (users.Count != crewUids.Count)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "One or more crew members do not exist.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var eventWorkTypes = new[]
        {
            LogisticsWorkType.Delivery,
            LogisticsWorkType.Setup,
            LogisticsWorkType.Teardown,
            LogisticsWorkType.Pickup
        };

        foreach (var item in request.WorkItems)
        {
            var requiresEvent = eventWorkTypes.Contains(item.Type);

            if (requiresEvent && item.EventUid == null)
            {
                return new ObjectResult(new ProblemDetails
                {
                    Title = "Bad Request",
                    Detail = $"{item.Type} requires an event.",
                    Status = StatusCodes.Status400BadRequest
                }) { StatusCode = StatusCodes.Status400BadRequest };
            }

            if (!requiresEvent && item.EventUid != null)
            {
                return new ObjectResult(new ProblemDetails
                {
                    Title = "Bad Request",
                    Detail = $"{item.Type} should not be attached to an event.",
                    Status = StatusCodes.Status400BadRequest
                }) { StatusCode = StatusCodes.Status400BadRequest };
            }
        }

        var eventUids = request.WorkItems
            .Where(w => w.EventUid.HasValue)
            .Select(w => w.EventUid!.Value)
            .Distinct()
            .ToList();

        var events = await _context.Events
            .Where(e => eventUids.Contains(e.Uid))
            .ToListAsync();

        if (events.Count != eventUids.Count)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "One or more events do not exist.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var eventsByUid = events.ToDictionary(e => e.Uid, e => e);

        var existingWorkItemsByUid = trip.WorkItems.ToDictionary(w => w.Uid);

        var incomingExistingWorkItemUids = request.WorkItems
            .Where(w => w.WorkItemUid.HasValue)
            .Select(w => w.WorkItemUid!.Value)
            .ToHashSet();

        var invalidWorkItemUid = incomingExistingWorkItemUids
            .FirstOrDefault(uid => !existingWorkItemsByUid.ContainsKey(uid));

        if (invalidWorkItemUid != Guid.Empty)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "One or more work items do not belong to this truck run.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var removedWorkItems = trip.WorkItems
            .Where(w => !incomingExistingWorkItemUids.Contains(w.Uid))
            .ToList();

        var protectedRemovedWorkItem = removedWorkItems
            .FirstOrDefault(w => w.Status != LogisticsWorkItemStatus.Pending);

        if (protectedRemovedWorkItem != null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Cannot remove a work item that has already started or been completed.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        _context.RemoveRange(removedWorkItems);
        _context.RemoveRange(trip.Crew);

        trip.Name = request.Name.Trim();
        trip.TruckId = truck.Id;
        trip.ScheduledStart = request.ScheduledStart;
        trip.ScheduledEnd = request.ScheduledEnd;
        trip.InternalNotes = request.InternalNotes;
        trip.UpdatedAt = DateTime.UtcNow;

        var orderedItems = request.WorkItems
            .OrderBy(w => w.SortOrder)
            .ToList();

        for (var index = 0; index < orderedItems.Count; index++)
        {
            var incomingItem = orderedItems[index];

            var eventId = incomingItem.EventUid.HasValue
                ? eventsByUid[incomingItem.EventUid.Value].Id
                : (int?)null;

            if (incomingItem.WorkItemUid.HasValue)
            {
                var existingItem = existingWorkItemsByUid[incomingItem.WorkItemUid.Value];

                var coreFieldsChanged =
                    existingItem.Type != incomingItem.Type ||
                    existingItem.EventId != eventId;

                if (existingItem.Status != LogisticsWorkItemStatus.Pending && coreFieldsChanged)
                {
                    return new ObjectResult(new ProblemDetails
                    {
                        Title = "Bad Request",
                        Detail = "Cannot change the type or event for a work item that has already started or been completed.",
                        Status = StatusCodes.Status400BadRequest
                    }) { StatusCode = StatusCodes.Status400BadRequest };
                }

                existingItem.SortOrder = index + 1;
                existingItem.Type = incomingItem.Type;
                existingItem.EventId = eventId;
                existingItem.SpecificNotes = incomingItem.SpecificNotes;
                existingItem.UpdatedAt = DateTime.UtcNow;

                // Important:
                // Do not touch Status, StartedAt, ArrivedAt, CompletedAt, Photos, or Uid.
                continue;
            }

            trip.WorkItems.Add(new LogisticsWorkItem
            {
                SortOrder = index + 1,
                Type = incomingItem.Type,
                EventId = eventId,
                SpecificNotes = incomingItem.SpecificNotes,
                Status = LogisticsWorkItemStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        trip.Crew = users.Select(u => new LogisticsAssignment
        {
            UserId = u.Id,
            IsLead = u.Id == crewLead.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }).ToList();

        foreach (var eventJob in events)
        {
            eventJob.Status = EventStatus.Scheduled;
            eventJob.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        var updatedTrip = await _context.LogisticsTrips
            .Include(t => t.Truck)
            .Include(t => t.Crew)
                .ThenInclude(c => c.User)
            .Include(t => t.WorkItems)
                .ThenInclude(w => w.Event)
            .FirstAsync(t => t.Uid == tripUid);

        return Ok(new
        {
            uid = updatedTrip.Uid,
            name = updatedTrip.Name,
            status = updatedTrip.Status.ToString(),
            truckUid = updatedTrip.Truck.Uid,
            truckName = updatedTrip.Truck.Name,
            scheduledStart = updatedTrip.ScheduledStart,
            scheduledEnd = updatedTrip.ScheduledEnd,
            crew = updatedTrip.Crew.Select(c => new
            {
                uid = c.Uid,
                userUid = c.User.Uid,
                fullName = $"{c.User.FirstName} {c.User.LastName}".Trim(),
                isLead = c.IsLead
            }),
            workItems = updatedTrip.WorkItems
                .OrderBy(w => w.SortOrder)
                .Select(w => new
                {
                    uid = w.Uid,
                    sortOrder = w.SortOrder,
                    type = w.Type.ToString(),
                    status = w.Status.ToString(),
                    eventUid = w.Event?.Uid,
                    eventName = w.Event?.EventName,
                    location = w.Event == null
                        ? null
                        : $"{w.Event.DeliveryCity}, {w.Event.DeliveryState}",
                    specificNotes = w.SpecificNotes
                })
        });
    }

    [HttpDelete("trips/manifest/{tripUid}")]
    public async Task<IActionResult> DeleteManifestTrip(Guid tripUid)
    {
        var trip = await _context.LogisticsTrips
            .Include(t => t.WorkItems)
            .Include(t => t.Crew)
            .FirstOrDefaultAsync(t => t.Uid == tripUid);

        if (trip == null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Not Found",
                Detail = "Truck run not found.",
                Status = StatusCodes.Status404NotFound
            }) { StatusCode = StatusCodes.Status404NotFound };
        }

        if (trip.Status != TripStatus.Scheduled)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Only scheduled runs can be deleted.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var protectedWorkItem = trip.WorkItems
            .FirstOrDefault(w => w.Status != LogisticsWorkItemStatus.Pending);

        if (protectedWorkItem != null)
        {
            return new ObjectResult(new ProblemDetails
            {
                Title = "Bad Request",
                Detail = "Cannot delete a run with work items that have already started or been completed.",
                Status = StatusCodes.Status400BadRequest
            }) { StatusCode = StatusCodes.Status400BadRequest };
        }

        var affectedEventIds = trip.WorkItems
            .Where(w => w.EventId.HasValue)
            .Select(w => w.EventId!.Value)
            .Distinct()
            .ToList();

        var affectedEvents = await _context.Events
            .Where(e => affectedEventIds.Contains(e.Id))
            .ToListAsync();

        _context.LogisticsAssignments.RemoveRange(trip.Crew);
        _context.LogisticsWorkItems.RemoveRange(trip.WorkItems);
        _context.LogisticsTrips.Remove(trip);

        await _context.SaveChangesAsync();

        var requiredTypes = new[]
        {
            LogisticsWorkType.Delivery,
            LogisticsWorkType.Setup,
            LogisticsWorkType.Teardown,
            LogisticsWorkType.Pickup
        };

        foreach (var eventJob in affectedEvents)
        {
            if (
                eventJob.Status == EventStatus.Cancelled ||
                eventJob.Status == EventStatus.Completed
            )
            {
                continue;
            }

            var remainingTypes = await _context.LogisticsWorkItems
                .Where(w => w.EventId == eventJob.Id)
                .Select(w => w.Type)
                .ToListAsync();

            var isStillFullyScheduled = requiredTypes.All(rt =>
                remainingTypes.Contains(rt)
            );

            eventJob.Status = isStillFullyScheduled
                ? EventStatus.Scheduled
                : EventStatus.Confirmed;

            eventJob.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}