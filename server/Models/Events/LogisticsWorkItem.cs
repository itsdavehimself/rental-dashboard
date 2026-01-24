public enum LogisticsWorkType
{
    Delivery,
    Setup,
    Teardown,
    Pickup
}

public class LogisticsWorkItem
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    
    public int LogisticsTripId { get; set; }
    public LogisticsTrip LogisticsTrip { get; set; } = null!;

    public LogisticsWorkType Type { get; set; }
    
    // This allows the "Auto-Complete" logic
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public string? SpecificNotes { get; set; } // e.g., "Table 4 is wobbly"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}