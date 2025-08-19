using Microsoft.AspNetCore.Mvc;
using server.DTOs.Inventory;
using server.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class InventoryController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public InventoryController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

[HttpGet]
public async Task<IActionResult> GetInventory(
  [FromQuery] int page = 1,
  [FromQuery] int pageSize = 25,
  [FromQuery] bool? IsActive = null,
  [FromQuery] bool? IsDeleted = false,
  [FromQuery] int? TypeId = null,
  [FromQuery] int? SubTypeId = null,
  [FromQuery] int? ColorId = null,
  [FromQuery] int? MaterialId = null,
  [FromQuery] int? BounceHouseTypeId = null,
  [FromQuery] string? Search = null
)
  {
    var query = _context.InventoryItems
      .Include(i => i.Purchases)
      .Include(i => i.Retirements)
      .Include(i => i.Type)
      .Include(i => i.SubType)
      .Include(i => i.Color)
      .Include(i => i.Material)
      .Include(i => i.BounceHouseType)
      .AsQueryable();

    if (IsActive.HasValue)
      query = query.Where(i => i.IsActive == IsActive.Value);

    if (IsDeleted.HasValue)
      query = query.Where(i => i.IsDeleted == IsDeleted.Value);

    if (TypeId.HasValue)
      query = query.Where(i => i.InventoryTypeId == TypeId.Value);

    if (SubTypeId.HasValue)
      query = query.Where(i => i.InventorySubTypeId == SubTypeId.Value);

    if (ColorId.HasValue)
      query = query.Where(i => i.InventoryColorId == ColorId.Value);

    if (MaterialId.HasValue)
      query = query.Where(i => i.InventoryMaterialId == MaterialId.Value);

    if (BounceHouseTypeId.HasValue)
      query = query.Where(i => i.BounceHouseTypeId == BounceHouseTypeId.Value);

    if (!string.IsNullOrWhiteSpace(Search))
    {
      var searchLower = Search.ToLower();
      query = query.Where(i =>
        i.Description.ToLower().Contains(searchLower) ||
        (i.SKU != null && i.SKU.ToLower().Contains(searchLower)) ||
        (i.Notes != null && i.Notes.ToLower().Contains(searchLower))
      );
    }

    var totalCount = await query.CountAsync();
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var pageData = await query
      .OrderBy(i => i.Description)
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToListAsync();

    var items = pageData.Select(i => new ListInventoryItemResponseDto
    {
      Uid = i.Uid,
      Description = i.Description,
      SKU = i.SKU,
      UnitPrice = i.UnitPrice,
      QuantityTotal = i.Purchases.Sum(p => p.QuantityPurchased) - i.Retirements.Sum(r => r.QuantityRetired),
      Type = i.Type?.Name ?? "",
      SubType = i.SubType?.Name ?? "",
      Material = i.Material?.Name,
      Color = i.Color?.Name,
      BounceHouseType = i.BounceHouseType?.Name
    }).ToList();

    return Ok(new PaginatedResponse<ListInventoryItemResponseDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = items
    });
  }

  [HttpPost("item")]
  public async Task<IActionResult> CreateInventoryItem(CreateInventoryItemDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    };

    var type = await _context.InventoryTypes.FirstOrDefaultAsync(t => t.Id == request.Type);
    var subtype = await _context.InventorySubTypes.FirstOrDefaultAsync(st => st.Id == request.SubType);
    var color = await _context.InventoryColors.FirstOrDefaultAsync(c => c.Id == request.Color);
    var material = await _context.InventoryMaterials.FirstOrDefaultAsync(m => m.Id == request.Material);

    var item = new InventoryItem
    {
      Description = request.Description,
      InventoryTypeId = request.Type,
      InventorySubTypeId = request.SubType,
      InventoryColorId = request.Color,
      InventoryMaterialId = request.Material,
      Notes = request.Notes,
      UnitPrice = request.UnitPrice,
      Length = request.Length,
      Width = request.Width,
      Height = request.Height,
      Type = type,
      SubType = subtype,
      Color = color,
      Material = material,
      Variant = request.Variant
    };

    item.SKU = InventorySkuHelper.GenerateSku(item, request.Variant);

    _context.InventoryItems.Add(item);
    await _context.SaveChangesAsync();

    return Ok(new ListInventoryItemResponseDto
    {
      Uid = item.Uid,
      Description = item.Description,
      SKU = item.SKU,
      UnitPrice = item.UnitPrice,
    });
  }

  [HttpGet("config")]
  public async Task<IActionResult> GetInventoryConfig()
  {
    var types = await _context.InventoryTypes
      .Include(t => t.SubTypes)
        .ThenInclude(st => st.Colors)
      .Include(t => t.SubTypes)
        .ThenInclude(st => st.Materials)
      .Include(t => t.SubTypes)
        .ThenInclude(st => st.BounceHouseTypes)
      .ToListAsync();

    var result = types.Select(t => new InventoryTypeDto
    {
      Id = t.Id,
      Name = t.Name,
      Label = t.Label,
      SubTypes = t.SubTypes.Select(st => new InventorySubTypeDto
      {
        Id = st.Id,
        Name = st.Name,
        Label = st.Label,
        Colors = st.Colors.Select(c => new InventoryColorDto
        {
          Id = c.Id,
          Name = c.Name,
          Label = c.Label,
        }).ToList(),
        Materials = st.Materials.Select(m => new InventoryMaterialDto
        {
          Id = m.Id,
          Name = m.Name,
          Label = m.Label,
        }).ToList(),
        BounceHouseTypes = st.BounceHouseTypes.Select(b => new BounceHouseTypeDto
        {
          Id = b.Id,
          Name = b.Name,
          Label = b.Label,
        }).ToList()
      }).ToList()
    }).ToList();

    return Ok(new { types = result });
  }
}