using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Helpers;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class AddressController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;


  public AddressController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet]
  public async Task<IActionResult> GetAddresses([FromQuery] string? query, int page = 1, int pageSize = 10)
  {
    if (string.IsNullOrWhiteSpace(query))
    {
      return Ok(new PaginatedResponse<AddressSearchResultDto>
      {
        Page = page,
        PageSize = pageSize,
        TotalCount = 0,
        TotalPages = 0,
        Data = new List<AddressSearchResultDto>()
      });
    }

    var queryable = _context.TaxJurisdictions
    .Where(a => EF.Functions.ILike(a.Address, query + "%"))
    .OrderBy(a => a.Address)
    .ThenBy(a => a.City);

    var totalCount = await queryable.CountAsync();

    var results = await queryable
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(a => new AddressSearchResultDto
        {
            Street = AddressFormatter.ToProperCase(a.Address),
            City = AddressFormatter.ToProperCase(a.City),
            State = a.State,
            ZipCode = a.ZipCode
        })
        .ToListAsync();

    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    return Ok(new PaginatedResponse<AddressSearchResultDto>
    {
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount,
        TotalPages = totalPages,
        Data = results
    });
  }
}