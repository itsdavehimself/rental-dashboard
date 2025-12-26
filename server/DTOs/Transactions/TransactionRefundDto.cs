using System.ComponentModel.DataAnnotations;

public class TransactionRefundDto
{
  [Required(ErrorMessage = "Refund amount is required")]
  public decimal Amount { get; set; }
  public string PaymentMethod { get; set; } = "";
  public string? ExternalTransactionId { get; set; }
  [Required(ErrorMessage = "Refund notes are required")]
  public string Notes { get; set; } = "";
  public Guid ProcessedByUid { get; set; } = Guid.NewGuid();
}