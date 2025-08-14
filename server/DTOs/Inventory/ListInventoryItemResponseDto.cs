namespace server.DTOs.Inventory;

public class ListInventoryItemResponseDto
{
  public Guid Uid { get; set; }
  public string Description { get; set; } = string.Empty;
  public int QuantityTotal { get; set; }
  public string SKU { get; set; } = string.Empty;
  public decimal? UnitPrice { get; set; }

  public string Type { get; set; } = string.Empty;
  public string SubType { get; set; } = string.Empty;
  public string? Material { get; set; }
  public string? Color { get; set; }
  public string? BounceHouseType { get; set; }
}
