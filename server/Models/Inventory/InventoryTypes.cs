namespace server.Models.Inventory;

public class InventoryType
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string SkuCode { get; set; } = string.Empty;
  public List<InventorySubType> SubTypes { get; set; } = [];
  public List<InventoryColor> Colors { get; set; } = [];
  public List<InventoryMaterial> Materials { get; set; } = [];
}