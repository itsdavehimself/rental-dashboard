using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

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
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Uid == request.TruckUid);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var crewLead = await _context.Users.FirstOrDefaultAsync(c => c.Uid == request.CrewLead);

    if (crewLead == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Lead user not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    if (request.Crew != null && request.Crew.Any())
    {
        var distinctCrewIds = request.Crew.Distinct().ToList();

        var validCrewCount = await _context.Users
            .CountAsync(u => distinctCrewIds.Contains(u.Uid));

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
        EventId = eventJob.Id,
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
                Type = type,
                IsCompleted = false
            });
        }
    }

    _context.LogisticsTrips.Add(newTrip);

    var assignments = new List<LogisticsAssignment>
    {
        new LogisticsAssignment
        {
            UserId = crewLead.Id,
            IsLead = true
        }
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
                assignments.Add(new LogisticsAssignment
                {
                    UserId = memberId,
                    IsLead = false
                });
            }
        }
    }

    newTrip.Crew = assignments;  
      
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
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var eventJob = await _context.Events.FirstOrDefaultAsync(e => e.Id == trip.EventId);

    if (eventJob == null)
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

    var truck = await _context.Trucks.FirstOrDefaultAsync(t => t.Id == trip.TruckId);

    if (truck == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Truck not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var newTrip = new LogisticsTrip
    {
      EventId = trip.EventId,
      Status = trip.Status,
      ScheduledStart = trip.ScheduledStart,
      ScheduledEnd = trip.ScheduledEnd,
      InternalNotes = trip.InternalNotes,
      TruckId = trip.TruckId
    };

    _context.LogisticsTrips.Add(newTrip);
    await _context.SaveChangesAsync();

    var workItems = await _context.LogisticsWorkItems.Where(w => w.LogisticsTripId == trip.Id).ToListAsync();

    workItems[1].LogisticsTripId = newTrip.Id;

    await _context.SaveChangesAsync();

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
}