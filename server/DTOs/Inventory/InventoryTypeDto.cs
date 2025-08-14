namespace server.DTOs.Inventory;

public class InventoryTypeDto
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Label { get; set; } = string.Empty;
  public List<InventorySubTypeDto> SubTypes { get; set; } = [];
}