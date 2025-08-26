using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Event;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class EventsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public EventsController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpPost]
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

    return Ok();
  }
}