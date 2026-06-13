using Microsoft.AspNetCore.Mvc;
using server.DTOs.Inventory;
using server.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using server.Helpers;
using System.Security.Claims;
using server.Models.Event;
using Amazon.S3;
using Amazon.S3.Model;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class InventoryController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IAmazonS3 _s3;

public InventoryController(
      AppDbContext context,
      IConfiguration config,
      IAmazonS3 s3
  )
  {
      _context = context;
      _config = config;
      _s3 = s3;
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
  public async Task<IActionResult> CreateInventoryItem(
      [FromForm] CreateInventoryItemDto request,
      [FromForm] IFormFile? image
  )
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

    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    ;

    var type = await _context.InventoryTypes.FirstOrDefaultAsync(t => t.Id == request.Type);
    if (type is null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "The inventory item type ID is invalid.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }
    var subtype = await _context.InventorySubTypes.FirstOrDefaultAsync(st => st.Id == request.SubType);
    if (subtype is null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "The inventory item subtype ID is invalid.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }
    var color = await _context.InventoryColors.FirstOrDefaultAsync(c => c.Id == request.Color);
    var material = await _context.InventoryMaterials.FirstOrDefaultAsync(m => m.Id == request.Material);

    var item = new InventoryItem
    {
      Description = request.Description,
      InventoryTypeId = request.Type,
      InventorySubTypeId = request.SubType,
      InventoryColorId = request.Color,
      InventoryMaterialId = request.Material,
      BounceHouseTypeId = request.BounceHouseType,
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

    item.SKU = InventorySkuHelper.GenerateSku(item);

    if (image != null && image.Length > 0)
    {
        var bucketName = _config["AWS:S3BucketName"];

        var extension = Path.GetExtension(image.FileName);
        var objectKey = $"inventory/items/{item.Uid}{extension}";

        await using var stream = image.OpenReadStream();

        var putRequest = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = objectKey,
            InputStream = stream,
            ContentType = image.ContentType
        };

        await _s3.PutObjectAsync(putRequest);

        item.ImageUrl = objectKey;
    }

    _context.InventoryItems.Add(item);
    await _context.SaveChangesAsync();

    return Ok(new ListInventoryItemResponseDto
    {
        Uid = item.Uid,
        Description = item.Description,
        SKU = item.SKU,
        UnitPrice = item.UnitPrice,
        ImageUrl = item.ImageUrl
    });
  }

  [HttpGet("fuzzy-search")]
  public async Task<IActionResult> FuzzySearchInventory(
    [FromQuery] string? query,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 25)
  {
    query = query?.ToLower().Trim();

    if (string.IsNullOrWhiteSpace(query))
    {
      return Ok(new PaginatedResponse<InventorySearchResultDto>
      {
        Page = page,
        PageSize = pageSize,
        TotalCount = 0,
        TotalPages = 0,
        Data = new List<InventorySearchResultDto>()
      });
    }

    var inventoryQuery = _context.InventoryItems
      .Include(i => i.Type)
      .Include(i => i.SubType)
      .Include(i => i.Material)
      .Include(i => i.Color)
      .Include(i => i.Purchases)
      .Include(i => i.Retirements)
      .AsQueryable();

    if (!string.IsNullOrWhiteSpace(query))
    {
        var tokens = query.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        foreach (var token in tokens)
        {
            var t = token.ToLower();
            inventoryQuery = inventoryQuery.Where(i =>
                i.Description.ToLower().Contains(t) ||
                i.SKU.ToLower().Contains(t) ||
                i.Type.Name.ToLower().Contains(t) ||
                i.SubType.Name.ToLower().Contains(t) ||
                (i.Material != null && i.Material.Name.ToLower().Contains(t)) ||
                (i.Color != null && i.Color.Name.ToLower().Contains(t))
            );
        }
    }

    var inventoryItems = await inventoryQuery.ToListAsync();

    var mappedInventoryItems = inventoryItems.Select(i => new InventorySearchResultDto
    {
        Uid = i.Uid,
        Description = i.Description,
        QuantityTotal = i.Purchases.Sum(p => p.QuantityPurchased)
            - i.Retirements.Sum(r => r.QuantityRetired),
        SKU = i.SKU,
        UnitPrice = i.UnitPrice,
        Type = i.Type.Name,
        SubType = i.SubType.Name,
        Material = i.Material?.Name,
        Color = i.Color?.Name,
        BounceHouseType = i.BounceHouseType?.Name,
        ImageUrl = GetInventoryImageUrl(i.ImageUrl)
    });

    var items = mappedInventoryItems.ToList();

    var totalCount = items.Count;
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var pagedResults = items
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToList();

    return Ok(new PaginatedResponse<InventorySearchResultDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = pagedResults
    });
  }

  [HttpPost("stock/{uid}")]
  public async Task<IActionResult> CreateInventoryPurchase(Guid uid, [FromBody] CreateInventoryPurchaseDto request)
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

    var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == uid);
    if (item == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Item not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    var purchase = new InventoryPurchase
    {
      InventoryItemId = item.Id,
      QuantityPurchased = request.QuantityPurchased,
      UnitCost = request.UnitCost,
      VendorName = request.VendorName
    };

    _context.InventoryPurchases.Add(purchase);
    await _context.SaveChangesAsync();

    var updatedItem = await _context.InventoryItems
      .Include(i => i.Purchases)
      .Include(i => i.Retirements)
      .FirstOrDefaultAsync(i => i.Id == item.Id);

    if (updatedItem == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Item not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    return Ok(new
    {
      updatedItem.Uid,
      QuantityTotal = updatedItem.Purchases.Sum(p => p.QuantityPurchased) - updatedItem.Retirements.Sum(r => r.QuantityRetired)
    });
  }

  [HttpPost("availability")]
  public async Task<IActionResult> CheckAvailability(CheckAvailabilityDto request)
  {
    var centralZone = TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");

    var deliveryDateTime = TimeZoneInfo.ConvertTimeToUtc(
        DateTime.SpecifyKind(
            request.StartDate.Date.Add(DateTime.Parse(request.StartTime).TimeOfDay),
            DateTimeKind.Unspecified
        ),
        centralZone
    );

    var pickupDateTime = TimeZoneInfo.ConvertTimeToUtc(
        DateTime.SpecifyKind(
            request.EndDate.Date.Add(DateTime.Parse(request.EndTime).TimeOfDay),
            DateTimeKind.Unspecified
        ),
        centralZone
    );

    var itemIds = await _context.InventoryItems
        .Where(i => request.Items.Contains(i.Uid))
        .Select(i => new { i.Id, i.Uid })
        .ToListAsync();

    var ids = itemIds.Select(x => x.Id).ToList();

    var events = _context.Events
    .Include(e => e.Items)
    .Where(e => e.Status != EventStatus.Draft
        && e.Uid != request.EventUid
        && e.EventStart <= pickupDateTime 
        && e.EventEnd >= deliveryDateTime);

    var reserved = await events
      .SelectMany(e => e.Items)
      .Where(x => x.InventoryItemId.HasValue && ids.Contains(x.InventoryItemId.Value))
      .GroupBy(x => x.InventoryItemId)
      .Select(g => new { InventoryItemId = g.Key!.Value, ReservedQty = g.Sum(x => x.Quantity) })
      .ToListAsync();

    var results = await _context.InventoryItems
      .Include(i => i.Purchases)
      .Include(i => i.Retirements)
      .Where(i => ids.Contains(i.Id))
      .ToListAsync();

    var response = results.Select(i =>
    {
      var reservedQty = reserved.FirstOrDefault(r => r.InventoryItemId == i.Id)?.ReservedQty ?? 0;
      var availableQty = 
          i.Purchases.Sum(p => p.QuantityPurchased) - i.Retirements.Sum(r => r.QuantityRetired)
          - reservedQty;

      return new {
        i.Uid,
        ReservedQuantity = reservedQty,
        AvailableQuantity = availableQty
      };
    });

    return Ok(response);
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

  [HttpGet("{uid}")]
  public async Task<IActionResult> GetItemByUid(Guid uid)
  {
      var item = await _context.InventoryItems
          .Include(i => i.Type)
          .Include(i => i.SubType)
          .Include(i => i.Color)
          .Include(i => i.Material)
          .Include(i => i.BounceHouseType)
          .Include(i => i.Purchases)
          .Include(i => i.Retirements).Include(i => i.Components)     
              .ThenInclude(c => c.ChildItem)   
          .FirstOrDefaultAsync(i => i.Uid == uid);

      if (item == null) return NotFound(new { message = "Item not found" });

      string? imageUrl = null;

      if (!string.IsNullOrWhiteSpace(item.ImageUrl))
      {
          var bucketName = _config["AWS:S3BucketName"];

          var presignedRequest = new GetPreSignedUrlRequest
          {
              BucketName = bucketName,
              Key = item.ImageUrl,
              Expires = DateTime.UtcNow.AddHours(1)
          };

          imageUrl = await _s3.GetPreSignedURLAsync(presignedRequest);
      }

      var response = new
      {
          uid = item.Uid,
          description = item.Description,
          type = item.Type?.Name ?? "",
          subType = item.SubType?.Name ?? "",
          color = item.Color?.Name ?? "",
          material = item.Material?.Name ?? "",
          bounceHouseType = item.BounceHouseType?.Name ?? "",
          sku = item.SKU,
          notes = item.Notes,
          imageUrl,
          length = item.Length,
          width = item.Width,
          height = item.Height,
          unitPrice = item.UnitPrice,
          averagePurchaseCost = item.AveragePurchaseCost,
          isActive = item.IsActive,
          packageOnly = item.PackageOnly,
          quantityTotal = item.Purchases.Sum(p => p.QuantityPurchased) - item.Retirements.Sum(r => r.QuantityRetired),
          components = item.Components.Select(c => new {
              id = c.Id,
              childItemUid = c.ChildItem.Uid,
              description = c.ChildItem.Description,
              sku = c.ChildItem.SKU,
              quantity = c.Quantity,
              isRequired = c.IsRequired
          }),
          purchases = item.Purchases.Select(p => new {
              id = p.Id,
              quantityPurchased = p.QuantityPurchased,
              unitCost = p.UnitCost,
              vendorName = p.VendorName,
              datePurchased = p.DatePurchased
          }),
          retirements = item.Retirements.Select(r => new {
              id = r.Id,
              quantityRetired = r.QuantityRetired,
              reason = (int)r.Reason, 
              notes = r.Notes,
              dateRetired = r.DateRetired
          })
      };

      return Ok(response);
  }

  public class RecordPurchaseDto 
  {
      public int Quantity { get; set; }
      public decimal UnitCost { get; set; }
      public string? VendorName { get; set; }
      public DateTime DatePurchased { get; set; }
  }

  [HttpPost("{uid}/purchase")]
  public async Task<IActionResult> RecordPurchase(Guid uid, [FromBody] RecordPurchaseDto request)
  {
      var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == uid);
      if (item == null) return NotFound();

      var purchase = new InventoryPurchase
      {
          InventoryItemId = item.Id,
          QuantityPurchased = request.Quantity,
          UnitCost = request.UnitCost,
          VendorName = request.VendorName,
          DatePurchased = request.DatePurchased.ToUniversalTime()
      };

      _context.InventoryPurchases.Add(purchase);
      await _context.SaveChangesAsync();

      return Ok(new {
          id = purchase.Id,
          quantityPurchased = purchase.QuantityPurchased,
          unitCost = purchase.UnitCost,
          vendorName = purchase.VendorName,
          datePurchased = purchase.DatePurchased
      });
  }

  public class RecordRetirementDto 
  {
      public int Quantity { get; set; }
      public ReasonType Reason { get; set; }
      public string? Notes { get; set; }
      public DateTime DateRetired { get; set; }
  }

  [HttpPost("{uid}/retire")]
  public async Task<IActionResult> RecordRetirement(Guid uid, [FromBody] RecordRetirementDto request)
  {
      var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == uid);
      if (item == null) return NotFound();

      var retirement = new InventoryRetirement
      {
          InventoryItemId = item.Id,
          QuantityRetired = request.Quantity,
          Reason = request.Reason,
          Notes = request.Notes,
          DateRetired = request.DateRetired.ToUniversalTime()
      };

      _context.InventoryRetirements.Add(retirement);
      await _context.SaveChangesAsync();

      return Ok(new {
          id = retirement.Id,
          quantityRetired = retirement.QuantityRetired,
          reason = (int)retirement.Reason,
          notes = retirement.Notes,
          dateRetired = retirement.DateRetired
      });
  }

  public class AddComponentDto 
  {
      public Guid ChildItemUid { get; set; }
      public int Quantity { get; set; }
      public bool IsRequired { get; set; }
  }

  [HttpPost("{uid}/components")]
  public async Task<IActionResult> AddComponent(Guid uid, [FromBody] AddComponentDto request)
  {
      var parent = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == uid);
      var child = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == request.ChildItemUid);

      if (parent == null || child == null) return NotFound(new { message = "Parent or Child item not found." });

      var existing = await _context.InventoryComponents
          .FirstOrDefaultAsync(c => c.ParentItemId == parent.Id && c.ChildItemId == child.Id);

      if (existing != null) return BadRequest(new { message = "This item is already attached as a component." });

      var component = new InventoryComponent
      {
          ParentItemId = parent.Id,
          ChildItemId = child.Id,
          Quantity = request.Quantity,
          IsRequired = request.IsRequired
      };

      _context.InventoryComponents.Add(component);
      await _context.SaveChangesAsync();

      return Ok(new {
          id = component.Id,
          childItemUid = child.Uid,
          description = child.Description,
          sku = child.SKU,
          quantity = component.Quantity,
          isRequired = component.IsRequired
      });
  }

  [HttpDelete("components/{componentId}")]
  public async Task<IActionResult> RemoveComponent(int componentId)
  {
      var component = await _context.InventoryComponents.FindAsync(componentId);
      if (component == null) return NotFound();

      _context.InventoryComponents.Remove(component);
      await _context.SaveChangesAsync();

      return Ok();
  }

  public class UpdateItemDto
  {
      public string Description { get; set; } = string.Empty;
      public decimal UnitPrice { get; set; }
      public decimal? Length { get; set; }
      public decimal? Width { get; set; }
      public decimal? Height { get; set; }
      public string? Notes { get; set; }
      public string? Variant { get; set; }
  }

  [HttpPut("{uid}")]
  public async Task<IActionResult> UpdateItem(Guid uid, [FromBody] UpdateItemDto request)
  {
      var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Uid == uid);
      if (item == null) return NotFound(new { message = "Item not found" });

      item.Description = request.Description;
      item.UnitPrice = request.UnitPrice;
      item.Length = request.Length;
      item.Width = request.Width;
      item.Height = request.Height;
      item.Notes = request.Notes;
      item.Variant = request.Variant;
      item.UpdatedAt = DateTime.UtcNow;

      await _context.SaveChangesAsync();

      return Ok(new { message = "Item updated successfully" });
  }

  private string? GetInventoryImageUrl(string? imageKey)
  {
      if (string.IsNullOrWhiteSpace(imageKey))
      {
          return null;
      }

      var bucketName = _config["AWS:S3BucketName"];

      var request = new GetPreSignedUrlRequest
      {
          BucketName = bucketName,
          Key = imageKey,
          Expires = DateTime.UtcNow.AddHours(1)
      };

      return _s3.GetPreSignedURL(request);
  }
  
}