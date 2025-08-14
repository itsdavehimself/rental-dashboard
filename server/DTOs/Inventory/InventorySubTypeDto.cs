namespace server.DTOs.Inventory;

public class InventorySubTypeDto {
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public List<InventoryColorDto> Colors { get; set; } = [];
  public List<InventoryMaterialDto> Materials { get; set; } = [];
  public List<BounceHouseTypeDto> BounceHouseTypes { get; set; } = [];
}