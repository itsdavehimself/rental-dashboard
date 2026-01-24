public class CrewResponseDto
{
  public string Name { get; set; } = "";
  public Guid Uid { get; set; } = Guid.NewGuid();
  public Guid TruckUid { get; set; }
  public string? Notes { get; set; }
  public Guid LeadUid { get; set; }
  public List<Guid> Crew { get; set; } = [];
}
