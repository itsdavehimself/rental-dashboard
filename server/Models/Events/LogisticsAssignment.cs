using server.Models.User;
using server.Models.Event;

public class LogisticsAssignment
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();

    public int LogisticsTripId { get; set; }
    public LogisticsTrip LogisticsTrip { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public bool IsLead { get; set; }
    public string? RoleNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}