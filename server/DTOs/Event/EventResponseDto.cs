namespace server.DTOs.Event;

using server.Models.Event;

public class EventResponseDto
{
  public Guid Uid { get; set; } = Guid.NewGuid();
  public Guid ClientUid { get; set; } = Guid.NewGuid();
  public string ClientName { get; set; } = "";
  public string? BusinessName { get; set; } = "";
  public string ClientPhone { get; set; } = "";
  public string ClientEmail { get; set; } = "";
  public string? EventName { get; set; }
  public DateTime EventStart { get; set; }
  public DateTime EventEnd { get; set; }
  public string BillingName { get; set; } = "";
  public string BillingAddressLine1 { get; set; } = "";
  public string? BillingAddressLine2 { get; set; }
  public string BillingCity { get; set; } = "";
  public string BillingState { get; set; } = "";
  public string BillingZipCode { get; set; } = "";
  public string DeliveryName { get; set; } = "";
  public string DeliveryAddressLine1 { get; set; } = "";
  public string? DeliveryAddressLine2 { get; set; }
  public string DeliveryCity { get; set; } = "";
  public string DeliveryState { get; set; } = "";
  public string DeliveryZipCode { get; set; } = "";
  public EventStatus Status { get; set; }
  public string? Notes { get; set; }
  public string? InternalNotes { get; set; }
  public List<LogisticsTaskResponseDto> LogisticsTasks { get; set; } = [];
  public List<EventItemResponseDto> Items { get; set; } = [];
  public decimal Subtotal { get; set; }
  public decimal TaxAmount { get; set; }
  public List<DiscountResponseDto> Discounts { get; set; } = [];
  public decimal Total { get; set; }
  public List<PaymentResponseDto> Payments { get; set; } = [];
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}