namespace server.Models.Inventory;

public enum ReasonType
{
  Broken,
  Lost,
  Sold,
  Stolen
}
public class InventoryRetirement
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int InventoryItemId { get; set; }
  public InventoryItem InventoryItem { get; set; } = null!;
  public int QuantityRetired { get; set; }
  public ReasonType Reason { get; set; }
  public DateTime DateRetired { get; set; } = DateTime.UtcNow;
  public string? Notes { get; set; }
}