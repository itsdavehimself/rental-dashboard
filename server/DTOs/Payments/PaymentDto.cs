public class PaymentDto
{
  public Guid EventUid { get; set; } = Guid.NewGuid();
  public decimal Amount { get; set; }
  public string PaymentMethod { get; set; } = "";
  public string? TransactionId { get; set; }
  public string? Notes { get; set; }
  public Guid CollectedByUid { get; set; } = Guid.NewGuid();
}