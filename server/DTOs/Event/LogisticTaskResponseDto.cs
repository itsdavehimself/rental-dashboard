using server.Models.User;
public class LogisticsTaskResponseDto
{
  public Guid Uid { get; set; } = Guid.NewGuid();
  public LogisticsTaskType Type { get; set; }
  public DateTime StartTime { get; set; }
  public DateTime EndTime { get; set; }
  public string CrewLead { get; set; } = "";
  public string? Notes { get; set; }
}