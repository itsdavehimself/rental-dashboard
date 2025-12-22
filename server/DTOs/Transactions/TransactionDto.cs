public class TransactionDto
{
  public Guid EventUid { get; set; } = Guid.NewGuid();
  public decimal Amount { get; set; }
  public string PaymentMethod { get; set; } = "";
  public string? ExternalTransactionId { get; set; }
  public string? Notes { get; set; }
  public Guid ProcessedByUid { get; set; } = Guid.NewGuid();
  public TransactionType Type { get; set; }
  public Guid? RelatedTransactionUid { get; set; }
}