using server.Models.Event;
using server.Models.Inventory;

public class EventItem
{
  public int Id { get; set; }
  public int EventId { get; set; }
  public Event Event { get; set; } = null!;
  public int? InventoryItemId { get; set; } 
  public InventoryItem? InventoryItem { get; set; }
  public int? PackageId { get; set; }
  public Package? Package { get; set; }
  public int Quantity { get; set; }
  public decimal UnitPrice { get; set; }
  public ItemType Type { get; set; }
}

public enum ItemType
{
  AlaCarte,
  Package
}