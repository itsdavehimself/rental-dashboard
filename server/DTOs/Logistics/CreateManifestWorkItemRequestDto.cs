using server.Models.Event;

namespace server.DTOs.Logistics;

public class CreateManifestWorkItemRequestDto
{
    public Guid? WorkItemUid { get; set; }
    public int SortOrder { get; set; }
    public LogisticsWorkType Type { get; set; }
    public Guid? EventUid { get; set; }
    public string? SpecificNotes { get; set; }
}