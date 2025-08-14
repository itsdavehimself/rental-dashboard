namespace server.Models.Inventory;

public class InventoryColor
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string SkuCode { get; set; } = string.Empty;
  public int InventorySubTypeId { get; set; }
  public InventorySubType? InventorySubType { get; set; }
}