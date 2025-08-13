using server.Models.Inventory;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Inventory;
public class CreateInventoryItemDto
{
  [Required(ErrorMessage = "Item description is required")]
  public string Description { get; set; } = string.Empty;
  [Required(ErrorMessage = "Item type is required")]
  public InventoryType Type { get; set; }
  [Required(ErrorMessage = "Item subtype is required")]
  public InventorySubType SubType { get; set; }
  [Required(ErrorMessage = "Item color is required")]
  public InventoryColor Color { get; set; }
  [Required(ErrorMessage = "Item quantity is required")]
  [Range(0, int.MaxValue, ErrorMessage = "Quantity must be zero or more")]
  public string? Notes { get; set; }
  [Range(1, int.MaxValue, ErrorMessage = "Length must be 1 or more")]
  public int? Length { get; set; }
  [Range(1, int.MaxValue, ErrorMessage = "Width must be 1 or more")]
  public int? Width { get; set; }
  [Range(1, int.MaxValue, ErrorMessage = "Height must be 1 or more")]
  public int? Height { get; set; }  
  [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative")]
  public decimal? UnitPrice { get; set; }
  [Range(0, double.MaxValue, ErrorMessage = "Purchase cost must be non-negative")]
  public MaterialType? Material { get; set; }
}