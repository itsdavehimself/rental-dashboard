using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.ResidentialClient;
using server.DTOs;
using server.Models.Client;
using server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
    var query = _context.ResidentialClients
        .Include(rc => rc.Client)
        .OrderBy(rc => rc.LastName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(rc => new ResidentialClientResponseDto
        {
          ClientId = rc.Client.Uid,
          FirstName = rc.FirstName,
          LastName = rc.LastName,
          Email = rc.Email,
          PhoneNumber = rc.PhoneNumber,
          Notes = rc.Client.Notes,
          CreatedAt = rc.Client.CreatedAt,
          Address = new AddressDto
          {
            Street = rc.Address.Street,
            Unit = rc.Address.Unit,
            City = rc.Address.City,
            State = rc.Address.State,
            ZipCode = rc.Address.ZipCode
          }
        });

    var results = await query.ToListAsync();

    return Ok(results);
  }

  [HttpPost("create")]
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

    _context.Clients.Add(client);
    await _context.SaveChangesAsync();

    var residential = new ResidentialClient
    {
      ClientId = client.Id,
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
      ClientId = client.Uid,
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
}
