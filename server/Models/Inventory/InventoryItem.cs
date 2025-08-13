namespace server.Models.Inventory;

public enum InventoryType {
  Table,
  Chair,
  Tent,
  Lighting,
  Attraction
}

public enum InventorySubType
{
  Folding,

  // Tents
  Canopy,
  Pole,

  // Attractions
  MechanicalBull,
  BounceHouse
}

public enum InventoryColor
{
  Black,
  White
}

public enum MaterialType
{
  Plastic,
  Resin,
  Metal,
  Vinyl
}

public class InventoryItem
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public string Description { get; set; } = string.Empty;
  public InventoryType Type { get; set; }
  public InventorySubType SubType { get; set; }
  public InventoryColor Color { get; set; }
  public int QuantityTotal { get; set; }
  public string SKU { get; set; } = string.Empty;
  public string? Notes { get; set; }
  public string? ImageUrl { get; set; }
  public bool IsActive { get; set; } = true;
  public bool PackageOnly { get; set; } = false;
  public bool IsDeleted { get; set; } = false;
  public decimal? UnitPrice { get; set; }
  public decimal? AveragePurchaseCost { get; set; }
  public int? Length { get; set; }
  public int? Width { get; set; }
  public int? Height { get; set; }
  public MaterialType? Material { get; set; }
  public List<InventoryPurchase> Purchases { get; set; } = [];
  public List<InventoryRetirement> Retirements { get; set; } = [];
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}