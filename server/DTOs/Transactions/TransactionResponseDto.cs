namespace server.DTOs;

public class TransactionResponseDto
{
  public Guid Uid { get; set; }
  public Guid EventUid { get; set; }
  public decimal Amount { get; set; }
  public TransactionType Type { get; set; }
  public PaymentMethod Method { get; set; }
  public DateTime OccurredAt { get; set; }
  public string? ExternalTransactionId { get; set; }
  public Guid? RelatedTransactionUid { get; set; }
  public string ProcessedBy { get; set; } = string.Empty;
  public string? Notes { get; set; }
  public string? CardBrand { get; set; }
  public string? Last4 { get; set; }
}
