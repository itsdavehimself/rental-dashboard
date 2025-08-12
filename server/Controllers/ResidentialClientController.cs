using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.ResidentialClient;
using server.DTOs;
using server.Models.Client;
using server.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class ResidentialClientController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public ResidentialClientController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet]
  public async Task<IActionResult> GetResidentialClients([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
  {
    var totalCount = await _context.Clients
      .Where(c => c.Type == ClientType.Residential)
      .CountAsync();

    var results = await _context.Clients
      .Where(c => c.Type == ClientType.Residential)
      .Include(c => c.ResidentialClient)
      .OrderBy(c => c.ResidentialClient!.LastName)
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .Select(c => new ResidentialClientResponseDto
      {
        Uid = c.Uid,
        FirstName = c.ResidentialClient!.FirstName,
        LastName = c.ResidentialClient!.LastName,
        Email = c.ResidentialClient.Email,
        PhoneNumber = c.ResidentialClient.PhoneNumber,
        Notes = c.Notes,
        CreatedAt = c.CreatedAt,
        Address = new AddressDto
        {
          Street = c.ResidentialClient.Address.Street,
          Unit = c.ResidentialClient.Address.Unit,
          City = c.ResidentialClient.Address.City,
          State = c.ResidentialClient.Address.State,
          ZipCode = c.ResidentialClient.Address.ZipCode
        }
      }).ToListAsync();

    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    return Ok(new PaginatedResponse<ResidentialClientResponseDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = results
    });
  }

  [HttpPost]
  public async Task<IActionResult> CreateClient(CreateResidentialClientDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var client = new Client
    {
      Type = ClientType.Residential,
      Notes = request.Notes,
      CreatedAt = DateTime.UtcNow,
    };

    var residential = new ResidentialClient
    {
      Client = client,
      FirstName = request.FirstName,
      LastName = request.LastName,
      PhoneNumber = request.PhoneNumber,
      Email = request.Email,
      Address = new Address
      {
        Street = request.Address.Street,
        Unit = request.Address.Unit,
        City = request.Address.City,
        State = request.Address.State,
        ZipCode = request.Address.ZipCode
      }
    };

    _context.ResidentialClients.Add(residential);
    await _context.SaveChangesAsync();

    return Ok(new ResidentialClientResponseDto
    {
      Uid = client.Uid,
      FirstName = residential.FirstName,
      LastName = residential.LastName,
      Email = residential.Email,
      PhoneNumber = residential.PhoneNumber,
      Notes = client.Notes,
      CreatedAt = client.CreatedAt,
      Address = new AddressDto
      {
        Street = residential.Address.Street,
        Unit = residential.Address.Unit,
        City = residential.Address.City,
        State = residential.Address.State,
        ZipCode = residential.Address.ZipCode
      }
    });
  }

  [HttpGet("{uid}")]
  public async Task<IActionResult> SearchClient(Guid uid)
  {
    var client = await _context.Clients.Include(c => c.ResidentialClient).FirstOrDefaultAsync(c => c.Uid == uid);

    if (client == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    return Ok(new ResidentialClientResponseDto
    {
      Uid = client.Uid,
      FirstName = client.ResidentialClient!.FirstName,
      LastName = client.ResidentialClient.LastName,
      Email = client.ResidentialClient.Email,
      PhoneNumber = client.ResidentialClient.PhoneNumber,
      Notes = client.Notes,
      CreatedAt = client.CreatedAt,
      Address = new AddressDto
      {
        Street = client.ResidentialClient.Address.Street,
        Unit = client.ResidentialClient.Address.Unit,
        City = client.ResidentialClient.Address.City,
        State = client.ResidentialClient.Address.State,
        ZipCode = client.ResidentialClient.Address.ZipCode
      }
    });
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

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == uid);

    if (client == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    _context.Clients.Remove(client);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}
