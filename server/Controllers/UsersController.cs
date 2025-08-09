using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using server.Models;

namespace server.Controllers;

[Authorize]
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
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    var isAdmin = role == "Admin";

    var query = _context.Users.AsQueryable();

    if (isActive.HasValue)
    {
      query = query.Where(u => u.IsActive == isActive.Value);
    }
    else if (!isAdmin)
    {
      query = query.Where(u => u.IsActive);
    }

    if (isAdmin)
    {
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
        startDate = u.StartDate != null ? u.StartDate : null,
        jobTitle = u.JobTitle != null ? u.JobTitle.Title : null,
        roleId = u.Role.Id,
        u.PayRate
      }).ToListAsync();

      return Ok(users);
    }
    else
    {
      var users = await query.Select(u => new
      {
        u.Uid,
        u.FirstName,
        u.LastName,
        u.Email,
        u.PhoneNumber,
        startDate = u.StartDate != null ? u.StartDate : null,
        jobTitle = u.JobTitle != null ? u.JobTitle.Title : null
      }).ToListAsync();

      return Ok(users);
    }
  }

  [HttpGet("{uid}")]
  public async Task<IActionResult> GetUser([FromRoute] Guid uid)
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
      startDate = u.StartDate != null ? u.StartDate : null,
      jobTitle = u.JobTitle != null ? u.JobTitle.Title : null,
      roleId = u.Role.Id,
      u.PayRate
    }).FirstOrDefaultAsync();

    if (user == null)
    return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    return Ok(user);
  }

  [HttpPatch("{uid}")]
  public async Task<IActionResult> UpdateUser(Guid uid, [FromBody] UpdateUserDto request)
  {
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    var isAdmin = role == "Admin";
    var isSelf = userIdFromToken == uid.ToString();

    if (!isAdmin && !isSelf)
    return new ObjectResult(new ProblemDetails
      {
        Title = "Forbidden",
        Detail = "You do not have permission to perform this action.",
        Status = StatusCodes.Status403Forbidden
      })
      {
        StatusCode = StatusCodes.Status403Forbidden
      };

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == uid);
    if (user == null)
    return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    if (request.FirstName != null)
      user.FirstName = request.FirstName;

    if (request.LastName != null)
      user.LastName = request.LastName;

    if (request.Email != null)
      user.Email = request.Email.Trim().ToLower();

    if (request.PhoneNumber != null)
      user.PhoneNumber = request.PhoneNumber;

    if (isAdmin)
    {
      if (request.RoleId != null)
      {
        var roleEntity = await _context.Roles.FindAsync(request.RoleId.Value);
        if (roleEntity == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Bad Request",
          Detail = "Invalid Role ID.",
          Status = StatusCodes.Status400BadRequest
        })
        {
          StatusCode = StatusCodes.Status400BadRequest
        };

        user.RoleId = request.RoleId.Value;
      }

      if (request.IsActive != null)
        user.IsActive = request.IsActive.Value;

      if (request.JobTitleId != null)
      {
        var jobTitleEntity = await _context.JobTitles.FindAsync(request.JobTitleId.Value);
        if (jobTitleEntity == null)
        return new ObjectResult(new ProblemDetails
        {
          Title = "Bad Request",
          Detail = "Invalid Job Title ID.",
          Status = StatusCodes.Status400BadRequest
        })
        {
          StatusCode = StatusCodes.Status400BadRequest
        };

        user.JobTitleId = request.JobTitleId.Value;
      }

      if (request.StartDate != null)
      {
        user.StartDate = request.StartDate;
      }

      if (request.PayRate != null)
      {
        user.PayRate = request.PayRate.Value;
      }
    }

    user.LastModifiedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return NoContent();
  }

  [HttpGet("me")]
  public async Task<IActionResult> Me()
  {
      var email = User.FindFirst(ClaimTypes.Email)?.Value;
      if (email is null)
      return new ObjectResult(new ProblemDetails
        {
          Title = "Unauthorized",
          Detail = "You are not authorized to perform this action.",
          Status = StatusCodes.Status401Unauthorized
        })
        {
          StatusCode = StatusCodes.Status401Unauthorized
        };

      var username = User.FindFirst(ClaimTypes.Name)?.Value;
      if (username is null)
      return new ObjectResult(new ProblemDetails
        {
          Title = "Unauthorized",
          Detail = "You are not authorized to perform this action.",
          Status = StatusCodes.Status401Unauthorized
        })
        {
          StatusCode = StatusCodes.Status401Unauthorized
        };

      var user = await _context.Users.Where(u => u.Email == email)
      .Select(u => new
      {
        u.Uid,
        u.FirstName,
        u.LastName,
        u.Email,
        roleId = u.RoleId,
        startDate = u.StartDate != null ? u.StartDate : null,
        jobTitle = u.JobTitle != null ? u.JobTitle.Title : null,
      })
      .FirstOrDefaultAsync();
      if (user is null)
      return new ObjectResult(new ProblemDetails
        {
          Title = "Unauthorized",
          Detail = "You are not authorized to perform this action.",
          Status = StatusCodes.Status401Unauthorized
        })
        {
          StatusCode = StatusCodes.Status401Unauthorized
        };

      return Ok(user);
  }

  [HttpDelete("{uid}")]
  public async Task<IActionResult> Delete(Guid uid)
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

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == uid);

    if (user == null)
    return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}