using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class RoleController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public RoleController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet]
  public async Task<IActionResult> GetRoles()
  {
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    if (role != "Admin")
    return new ObjectResult(new ProblemDetails
      {
        Title = "Forbidden",
        Detail = "You do not have permission to perform this action.",
        Status = StatusCodes.Status403Forbidden
      })
      {
        StatusCode = StatusCodes.Status403Forbidden
      };

    var roles = await _context.Roles.Select(r => new
    {
      r.Id,
      r.Name
    }).ToListAsync();

    return Ok(roles);
  }
}