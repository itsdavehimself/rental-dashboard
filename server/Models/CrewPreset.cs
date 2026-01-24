using server.Models.User;

public class CrewPreset
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public string Name { get; set; } = "";
  public int TruckId { get; set; }
  public Truck Truck  { get; set; } = null!;
  public string? Notes { get; set; }
  public int LeadId { get; set; }
  public List<User> Crew { get; set; } = [];
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
