namespace server.Models.Inventory;
public class InventoryItem
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public string Description { get; set; } = string.Empty;
  public int InventoryTypeId { get; set; }
  public required InventoryType Type { get; set; }
  public int InventorySubTypeId { get; set; }
  public required InventorySubType SubType { get; set; }
  public int? InventoryMaterialId { get; set; }
  public InventoryMaterial? Material { get; set; }
  public int? InventoryColorId { get; set; }
  public InventoryColor? Color { get; set; }
  public int? BounceHouseTypeId { get; set; }
  public BounceHouseType? BounceHouseType { get; set; }
  public string SKU { get; set; } = string.Empty;
  public string? Notes { get; set; }
  public string? ImageUrl { get; set; }
  public bool IsActive { get; set; } = true;
  public bool PackageOnly { get; set; } = false;
  public bool IsDeleted { get; set; } = false;
  public decimal? UnitPrice { get; set; }
  public decimal? AveragePurchaseCost { get; set; }
  public decimal? Length { get; set; }
  public decimal? Width { get; set; }
  public decimal? Height { get; set; }
  public string? Variant { get; set; } = string.Empty;
  public List<InventoryPurchase> Purchases { get; set; } = [];
  public List<InventoryRetirement> Retirements { get; set; } = [];
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}