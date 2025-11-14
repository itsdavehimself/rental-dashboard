namespace server.DTOs.Inventory;

public class CheckAvailabilityDto
{
  public List<Guid> Items { get; set; } = [];
  public DateTime StartDate { get; set; } = DateTime.UtcNow;
  public string StartTime { get; set; } = "";
  public DateTime EndDate { get; set; } = DateTime.UtcNow;
  public string EndTime { get; set; } = "";
}