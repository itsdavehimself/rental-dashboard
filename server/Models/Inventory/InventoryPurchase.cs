namespace server.Models.Inventory;

public class InventoryPurchase
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int InventoryItemId { get; set; }
  public InventoryItem InventoryItem { get; set; } = null!;
  public int QuantityPurchased { get; set; }
  public decimal UnitCost { get; set; }
  public DateTime DatePurchased { get; set; } = DateTime.UtcNow;
  public string? VendorName { get; set; }
}