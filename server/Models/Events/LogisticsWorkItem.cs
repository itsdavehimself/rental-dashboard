namespace server.Models.Event;

public enum LogisticsWorkType
{
    WarehouseLoad,
    WarehouseReload,
    WarehouseUnload,
    ReturnToWarehouse,
    Delivery,
    Setup,
    Teardown,
    Pickup
}

public enum LogisticsWorkItemStatus
{
    Pending,
    InProgress,
    Arrived,
    Completed,
    Skipped,
    Cancelled
}

public class LogisticsWorkItem
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    
    public int LogisticsTripId { get; set; }
    public LogisticsTrip LogisticsTrip { get; set; } = null!;
    public int SortOrder { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? ArrivedAt { get; set; }
 
    public int? EventId { get; set; }
    public Event? Event { get; set; } 

    public LogisticsWorkType Type { get; set; }
    
    public LogisticsWorkItemStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public string? SpecificNotes { get; set; } 

   
    public List<LogisticsPhoto> Photos { get; set; } = [];

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}