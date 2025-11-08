public class EventItemResponseDto
{
  public Guid Uid { get; set; } = Guid.NewGuid();
  public Guid? InventoryItemUid { get; set; } = Guid.NewGuid();
  public string Description { get; set; } = "";
  public decimal UnitPrice { get; set; }
  public ItemType Type { get; set; }
  public Guid? PackageUid { get; set; }
  public int Quantity { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}