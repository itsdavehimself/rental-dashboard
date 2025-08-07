using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class JobTitleController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public JobTitleController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet]
  public async Task<IActionResult> GetJobTitles()
  {
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    if (role != "Admin")
      return Forbid();

    var jobs = await _context.JobTitles.Select(jt => new
    {
      jt.Id,
      jt.Title,
    }).ToListAsync();

    return Ok(jobs);
  }
}