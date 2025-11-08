using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class TaxController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public TaxController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet("{zipcode}")]
  public async Task<IActionResult> GetTaxRate(string zipCode)
  {
    if (zipCode == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "A zip code is required.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }

    var taxRate = await _context.TaxJurisdictions.FirstOrDefaultAsync(t => t.ZipCode == zipCode);

    if (taxRate == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Tax rate not found for that zip code.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }

    return Ok(new
    {
      zipCode,
      taxRate = taxRate.HighRate
    });
  }
}