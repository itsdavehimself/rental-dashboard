namespace server.DTOs.Event;

using server.DTOs.Address;

public class CreateEventDto
{
  public Guid ClientUid { get; set; }
  public string? EventName { get; set; }
  public DateTime EventStart { get; set; }
  public DateTime EventEnd { get; set; }
  public AddressDto Address { get; set; } = new();
  public string? Notes { get; set; }
  public List<EventItemDto> Items { get; set; } = [];
}