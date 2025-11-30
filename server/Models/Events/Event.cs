using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Event;
public class Event
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int ClientId { get; set; }
  public Guid ClientUid { get; set; } = Guid.NewGuid();
  public string ClientFirstName { get; set; } = "";
  public string ClientLastName { get; set; } = "";
  public string? BusinessName { get; set; } = "";
  public string ClientPhone { get; set; } = "";
  public string ClientEmail { get; set; } = "";
  public string? EventName { get; set; }
  public DateTime EventStart { get; set; }
  public DateTime EventEnd { get; set; }
  public Guid? BillingAddressEntryUid { get; set; } = Guid.NewGuid();
  public string BillingFirstName { get; set; } = "";
  public string BillingLastName { get; set; } = "";
  public string BillingAddressLine1 { get; set; } = "";
  public string? BillingAddressLine2 { get; set; }
  public string BillingCity { get; set; } = "";
  public string BillingState { get; set; } = "";
  public string BillingZipCode { get; set; } = "";
  public string BillingPhone { get; set; } = "";
  public string BillingEmail { get; set; } = "";
  public Guid? DeliveryAddressEntryUid { get; set; } = Guid.NewGuid();
  public string DeliveryFirstName { get; set; } = "";
  public string DeliveryLastName { get; set; } = "";
  public string DeliveryAddressLine1 { get; set; } = "";
  public string? DeliveryAddressLine2 { get; set; }
  public string DeliveryCity { get; set; } = "";
  public string DeliveryState { get; set; } = "";
  public string DeliveryZipCode { get; set; } = "";
  public string DeliveryPhone { get; set; } = "";
  public string DeliveryEmail { get; set; } = "";
  public EventStatus Status { get; set; } = EventStatus.Draft;
  public string EventType { get; set; } = "";
  public string? Notes { get; set; }
  public string? InternalNotes { get; set; }
  public List<LogisticsTask> LogisticsTasks { get; set; } = [];
  public List<EventItem> Items { get; set; } = [];
  public decimal Subtotal { get; set; }
  public decimal TaxAmount { get; set; }
  public List<Discount> Discounts { get; set; } = [];
  public decimal Total { get; set; }
  public List<Payment> Payments { get; set; } = [];
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum EventStatus
{
  Draft,
  Confirmed,
  Scheduled,
  Completed,
  Cancelled
}