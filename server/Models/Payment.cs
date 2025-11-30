using server.Models.Event;
using server.Models.User;
public class Payment
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int EventId { get; set; }
  public Event Event { get; set; } = null!;
  public decimal Amount { get; set; }
  public PaymentMethod Method { get; set; }
  public DateTime ReceivedAt { get; set; }
  public string? TransactionId { get; set; }
  public bool Refunded { get; set; }
  public decimal RefundedAmount { get; set; }
  public DateTime? RefundedAt { get; set; }
  public string? RefundReason { get; set; }
  public int CollectedById { get; set; }
  public User CollectedBy { get; set; } = null!;
  public string? Notes { get; set; }
}
public enum PaymentMethod
{
  Cash,
  CreditCard,
  DebitCard,
  Zelle,
  Check,
  BankTransfer,
  Square,
  Stripe,
  Venmo,
  PayPal
}