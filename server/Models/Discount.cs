public class Discount
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int EventId { get; set; }
  public DiscountType Type { get; set; }
  public decimal Amount { get; set; }
  public string? Reason { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum DiscountType
{
  FlatAmount,
  Percentage
}