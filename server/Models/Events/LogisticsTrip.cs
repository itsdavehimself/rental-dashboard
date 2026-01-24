using server.Models.Event;

public enum TripStatus
{
    Scheduled,
    OnWay,
    Arrived,
    Completed,
    Cancelled
}

public class LogisticsTrip
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    // This handles the "3-tap" flow (Start -> Arrive -> Finish)
    public TripStatus Status { get; set; } = TripStatus.Scheduled;
    
    // Planning times
    public DateTime ScheduledStart { get; set; }
    public DateTime ScheduledEnd { get; set; }
    
    // Reality tracking (Set automatically via the app buttons)
    public DateTime? ActualStart { get; set; }
    public DateTime? ActualArrival { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Relationships
    public List<LogisticsWorkItem> WorkItems { get; set; } = [];
    public List<LogisticsAssignment> Crew { get; set; } = [];

    // Truck
    public int TruckId { get; set; }
    public Truck Truck { get; set; } = null!;
    
    public string? InternalNotes { get; set; } // Notes for the whole trip/truck
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}