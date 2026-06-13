namespace server.Models.Event;

public enum TripStatus
{
    Scheduled,
    InProgress,
    Completed,
    Cancelled
}

public class LogisticsTrip
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
        
    public TripStatus Status { get; set; } = TripStatus.Scheduled;
    
    public DateTime ScheduledStart { get; set; }
    public DateTime ScheduledEnd { get; set; }
    
    public DateTime? ActualStart { get; set; }
    public DateTime? ActualArrival { get; set; }
    public DateTime? CompletedAt { get; set; }

    public List<LogisticsWorkItem> WorkItems { get; set; } = [];
    public List<LogisticsAssignment> Crew { get; set; } = [];

    public int TruckId { get; set; }
    public Truck Truck { get; set; } = null!;
    
    public string? InternalNotes { get; set; } 
    
    public string? ClientSignatureUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}