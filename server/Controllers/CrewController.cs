using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CrewController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;

  public CrewController(AppDbContext context, IConfiguration config, IMapper mapper)
  {
    _context = context;
    _config = config;
    _mapper = mapper;

  }

  [HttpGet]
  public async Task<IActionResult> GetTrucks()
  {
    var crews = await _context.CrewPresets
      .Include(c => c.Truck)
      .Include(c => c.Crew)
      .ToListAsync();

    var response = _mapper.Map<List<CrewResponseDto>>(crews);

    return Ok(response);
  }
}
