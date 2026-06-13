using server.Models.Event;

namespace server.DTOs.Logistics;

public class CreateManifestTripRequestDto
{
    public string Name { get; set; } = "";
    public Guid TruckUid { get; set; }
    public Guid CrewLeadUid { get; set; }
    public List<Guid> CrewUids { get; set; } = [];
    public DateTime ScheduledStart { get; set; }
    public DateTime ScheduledEnd { get; set; }
    public string? InternalNotes { get; set; }
    public List<CreateManifestWorkItemRequestDto> WorkItems { get; set; } = [];
}