namespace server.Models.Event;

public class LogisticsPhoto
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    
    public int LogisticsWorkItemId { get; set; }
    public LogisticsWorkItem LogisticsWorkItem { get; set; } = null!;

    public string PhotoUrl { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}