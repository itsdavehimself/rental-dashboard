using server.Models.Inventory;

namespace server.DTOs.Inventory;
public class ListInventoryItemResponseDto
{
  public Guid Uid { get; set; }
  public string Description { get; set; } = string.Empty;
  public int QuantityTotal { get; set; }
  public string SKU { get; set; } = string.Empty;
  public decimal? UnitPrice { get; set; }
}