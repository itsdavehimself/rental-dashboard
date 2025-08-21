namespace server.DTOs.Event;

using server.Models.Event;

public class CreateEventDto
{
  public string ClientUid { get; set; } = string.Empty;
  public string? EventName { get; set; }
  public DateTime EventStart { get; set; }
  public DateTime EventEnd { get; set; }
  public AddressDto Address { get; set; } = new();
  public string? Notes { get; set; }
  public List<EventItemDto> Items { get; set; } = [];
}