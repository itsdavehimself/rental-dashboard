public class LogisticsAssignmentResponseDto
{
    public Guid Uid { get; set; }
    public Guid UserUid { get; set; }
    public string FullName { get; set; } = "";
    public bool IsLead { get; set; }
    public string? RoleNotes { get; set; }
}