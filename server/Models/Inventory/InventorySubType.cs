namespace server.Models.Inventory;

public class InventorySubType
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Label { get; set; } = string.Empty;
  public string SkuCode { get; set; } = string.Empty;
  public int InventoryTypeId { get; set; }
  public InventoryType? InventoryType { get; set; }
  public List<InventoryMaterial> Materials { get; set; } = [];
  public List<InventoryColor> Colors { get; set; } = [];
  public List<BounceHouseType> BounceHouseTypes { get; set; } = [];
}