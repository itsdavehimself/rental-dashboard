public class TruckResponseDto
{
    public Guid Uid { get; set; }
    public string Name { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public int? CapacityCubicFeet { get; set; }
    public int? WeightLimit { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<LogisticsTripResponseDto> Trips { get; set; } = [];

}