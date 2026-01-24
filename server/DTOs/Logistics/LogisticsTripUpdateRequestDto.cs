public class LogisticsTripUpdateRequestDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public List<Guid> Crew { get; set; } = [];
    public Guid CrewLead { get; set; }
    public Guid TruckUid { get; set; }
}