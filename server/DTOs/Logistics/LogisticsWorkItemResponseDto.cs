public class LogisticsWorkItemResponseDto
{
    public Guid Uid { get; set; }
    public LogisticsWorkType Type { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Notes { get; set; }
}