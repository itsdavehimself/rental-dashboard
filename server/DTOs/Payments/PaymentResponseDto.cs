namespace server.DTOs;
public class PaymentResponseDto
{
  public Guid Uid { get; set; } = Guid.NewGuid();
  public Guid EventUid { get; set; } = Guid.NewGuid();
  public decimal Amount { get; set; }
  public PaymentMethod Method { get; set; }
  public DateTime ReceivedAt { get; set; }
  public string? TransactionId { get; set; }
  public bool Refunded { get; set; }
  public decimal RefundedAmount { get; set; }
  public DateTime? RefundedAt { get; set; }
  public string? RefundReason { get; set; }
  public string? Notes { get; set; }
  public string CollectedBy { get; set; } = string.Empty;
}