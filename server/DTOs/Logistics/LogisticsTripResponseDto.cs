public class LogisticsTripResponseDto
{
    public Guid Uid { get; set; }
    public string Status { get; set; } = ""; 
    
    // Timing
    public DateTime ScheduledStart { get; set; }
    public DateTime ScheduledEnd { get; set; }
    public DateTime? ActualStart { get; set; }
    public DateTime? ActualArrival { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Child Data
    public List<LogisticsWorkItemResponseDto> WorkItems { get; set; } = [];
    public List<LogisticsAssignmentResponseDto> Crew { get; set; } = [];

    // Truck
    public Guid TruckUid { get; set; }
    public string TruckName { get; set; } = "";

    // Helper for UI
    public string? CrewLeadName => Crew.FirstOrDefault(c => c.IsLead)?.FullName;
    public string TripSummary => string.Join(" / ", WorkItems.Select(w => w.Type.ToString()));
}