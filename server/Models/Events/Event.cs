namespace server.Models.Event;
using server.Models.Clients;
public class Event
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int ClientId { get; set; }
  public Client Client { get; set; } = null!;
  public string? EventName { get; set; }
  public DateTime EventStart { get; set; }
  public DateTime EventEnd { get; set; }
  public int AddressId { get; set; }
  public Address Address { get; set; } = null!;
  public EventStatus Status { get; set; } = EventStatus.Draft;
  public string? Notes { get; set; }
  public List<LogisticsTask> LogisticsTasks { get; set; } = [];
  public List<EventItem> Items { get; set; } = [];
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