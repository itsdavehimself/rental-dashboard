using server.Models.Event;
using server.Models.User;
public class LogisticsTask
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public int EventId { get; set; }
  public Event Event { get; set; } = null!;
  public LogisticsTaskType Type { get; set; }
  public DateTime StartTime { get; set; }
  public DateTime EndTime { get; set; }
  public int? CrewLeadId { get; set; }
  public User? CrewLead { get; set; }
  public string? Notes { get; set; }
}

public enum LogisticsTaskType
{
  Delivery,
  Pickup,
  Setup,
  Teardown
}
