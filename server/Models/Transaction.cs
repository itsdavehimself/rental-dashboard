using server.Models.Event;
using server.Models.User;

public class Transaction
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int EventId { get; set; }
  public Event Event { get; set; } = null!;
  public decimal Amount { get; set; }
  public TransactionType Type { get; set; }
  public PaymentMethod Method { get; set; }
  public DateTime OccurredAt { get; set; }
  public string? ExternalTransactionId { get; set; }
  public int? RelatedTransactionId { get; set; }
  public Transaction? RelatedTransaction { get; set; }
  public int ProcessedById { get; set; }
  public User ProcessedBy { get; set; } = null!;
  public string? Notes { get; set; }
}

public enum TransactionType
{
  Payment,
  Refund,
  Adjustment
}

public enum PaymentMethod
{
  Cash,
  Card,
  Zelle,
  Check,
  BankTransfer,
  Square,
  Stripe,
  Venmo,
  PayPal
}
