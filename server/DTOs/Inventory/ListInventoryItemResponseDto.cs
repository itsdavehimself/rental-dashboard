using server.Models.Inventory;

namespace server.DTOs.Inventory;
public class CreateInventoryItemResponseDto
{
  public Guid Uid { get; set; }
  public string Description { get; set; } = string.Empty;
  public InventoryType Type { get; set; }
  public InventorySubType SubType { get; set; }
  public InventoryColor Color { get; set; }
  public int QuantityTotal { get; set; }
  public string SKU { get; set; } = string.Empty;
  public MaterialType? Material { get; set; }
  public decimal? UnitPrice { get; set; }
}