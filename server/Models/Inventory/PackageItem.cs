using server.Models.Inventory;

public class PackageItem
{
  public int Id { get; set; }
  public int PackageId { get; set; }
  public Package Package { get; set; } = null!;
  public int InventoryItemId { get; set; }
  public InventoryItem InventoryItem { get; set; } = null!;
  public int Quantity { get; set; }
}