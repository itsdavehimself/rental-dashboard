using server.Models.Event;

public class Truck
{
    public int Id { get; set; }
    public Guid Uid { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public int? CapacityCubicFeet { get; set; }
    public int? WeightLimit { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<LogisticsTrip> Trips { get; set; } = [];
}