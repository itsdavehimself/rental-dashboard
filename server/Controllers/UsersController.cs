using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UsersController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public UsersController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet]
  public async Task<IActionResult> SearchUsers([FromQuery] bool? isActive)
  {
    var query = _context.Users.AsQueryable();

    if (isActive.HasValue)
    {
      query = query.Where(u => u.IsActive == isActive.Value);
    }

    var users = await query.Select(u => new
    {
      u.Uid,
      u.FirstName,
      u.LastName,
      u.Email,
      u.PhoneNumber,
      u.CreatedAt,
      u.LastModifiedAt,
      u.IsActive,
      role = u.Role.Name
    }).ToListAsync();

    return Ok(users);
  }

  [HttpGet("{uid}")]
  public async Task<IActionResult> GetUser(Guid uid)
  {
    var user = await _context.Users.Where(u => u.Uid == uid).Select(u => new
    {
      u.Uid,
      u.FirstName,
      u.LastName,
      u.Email,
      u.PhoneNumber,
      u.CreatedAt,
      u.LastModifiedAt,
      u.IsActive,
      role = u.Role.Name
    }).FirstOrDefaultAsync();

    if (user == null)
    {
      return NotFound(new { message = "User not found" });
    }

    return Ok(user);
  }

  [HttpPatch("{uid}")]
  public async Task<IActionResult> UpdateUser(Guid uid, [FromBody] UpdateUserDto request)
  {
    var user = await _context.Users.Where(u => u.Uid == uid).FirstOrDefaultAsync();

    if (user == null)
      return NotFound(new { message = "User not found" });

    if (request.FirstName != null)
      user.FirstName = request.FirstName;

    if (request.LastName != null)
      user.LastName = request.LastName;

    if (request.Email != null)
      user.Email = request.Email;

    if (request.PhoneNumber != null)
      user.PhoneNumber = request.PhoneNumber;

    if (request.RoleId != null)
      user.RoleId = request.RoleId.Value;

    if (request.IsActive != null)
      user.IsActive = request.IsActive.Value;

    user.LastModifiedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return NoContent();
  }

  [HttpDelete("{uid}")]
  public async Task<IActionResult> Delete(Guid uid)
  {
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == uid);

    if (user == null)
    {
      return NotFound(new { message = "User not found" });
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}