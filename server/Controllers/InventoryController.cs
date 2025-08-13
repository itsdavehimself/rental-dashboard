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
  [FromQuery] InventoryType? Type = null,
  [FromQuery] InventorySubType? SubType = null,
  [FromQuery] InventoryColor? Color = null,
  [FromQuery] string? Search = null
  )
  {
    var query = _context.InventoryItems
      .Include(i => i.Purchases)
      .Include(i => i.Retirements)
      .AsQueryable();

    if (IsActive.HasValue)
      query = query.Where(i => i.IsActive == IsActive.Value);

    if (IsDeleted.HasValue)
      query = query.Where(i => i.IsDeleted == IsDeleted.Value);

    if (Type.HasValue)
      query = query.Where(i => i.Type == Type.Value);

    if (SubType.HasValue)
      query = query.Where(i => i.SubType == SubType.Value);

    if (Color.HasValue)
      query = query.Where(i => i.Color == Color.Value);

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

    var items = await query
      .OrderBy(i => i.Description)
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .Select(i => new ListInventoryItemResponseDto
      {
        Uid = i.Uid,
        Description = i.Description,
        SKU = i.SKU,
        UnitPrice = i.UnitPrice,
        QuantityTotal = i.Purchases.Sum(p => p.QuantityPurchased) - i.Retirements.Sum(r => r.QuantityRetired)
      })
        .ToListAsync();

    return Ok(new PaginatedResponse<ListInventoryItemResponseDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = items
    });
  }

  [HttpPost]
  public async Task<IActionResult> CreateInventoryItem(CreateInventoryItemDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    };

    var sku = InventorySkuHelper.GenerateSku(
      request.Type,
      request.SubType,
      request.Color,
      request.Material,        
      request.Length,
      request.Width
    );

    var item = new InventoryItem
    {
      Description = request.Description,
      Type = request.Type,
      SubType = request.SubType,
      Color = request.Color,
      SKU = sku,
      Notes = request.Notes,
      UnitPrice = request.UnitPrice,
      Length = request.Length,
      Width = request.Width,
      Height = request.Height,
      Material = request.Material
    };

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

  [HttpGet("enums")]
  public IActionResult GetInventoryEnums()
  {
    var types = Enum.GetValues(typeof(InventoryType))
        .Cast<InventoryType>()
        .Select(t => new { Value = (int)t, Label = t.ToString() });

    var subTypes = Enum.GetValues(typeof(InventorySubType))
        .Cast<InventorySubType>()
        .Select(t => new { Value = (int)t, Label = t.ToString() });

    var colors = Enum.GetValues(typeof(InventoryColor))
        .Cast<InventoryColor>()
        .Select(c => new { Value = (int)c, Label = c.ToString() });

    var materials = Enum.GetValues(typeof(MaterialType))
        .Cast<MaterialType>()
        .Select(m => new { Value = (int)m, Label = m.ToString() });

    return Ok(new
    {
      Types = types,
      SubTypes = subTypes,
      Colors = colors,
      Materials = materials
    });
  }
}