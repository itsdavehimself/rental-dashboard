namespace server.DTOs.Event;

public class CreateEventDto
{
  public Guid ClientUid { get; set; }
  public string? EventName { get; set; }
  public DateTime DeliveryDate { get; set; }
  public string DeliveryTime { get; set; } = "";
  public DateTime PickUpDate { get; set; }
  public string PickUpTime { get; set; } = "";
  public Guid BillingAddress { get; set; }
  public Guid DeliveryAddress { get; set; }
  public string? Notes { get; set; }
  public string? InternalNotes { get; set; }
  public List<EventItemDto> Items { get; set; } = [];
}