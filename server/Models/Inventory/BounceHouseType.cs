namespace server.Models.Inventory;

public class BounceHouseType
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public int InventorySubTypeId { get; set; } 
  public InventorySubType? InventorySubType { get; set; }
}