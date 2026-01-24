public class LogisticsTripRequestDto
{
    public Guid EventUid { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public List<Guid> Crew { get; set; } = [];
    public Guid CrewLead { get; set; }
    public Guid TruckUid { get; set; }
    public string TaskType { get; set; } = "";
}