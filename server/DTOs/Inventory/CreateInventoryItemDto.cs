using server.Models.Inventory;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Inventory;
public class CreateInventoryItemDto
{
  [Required(ErrorMessage = "Item description is required")]
  public string Description { get; set; } = string.Empty;
  [Required(ErrorMessage = "Item type is required")]
  public int Type { get; set; }
  [Required(ErrorMessage = "Item subtype is required")]
  public int SubType { get; set; }
  public int? Color { get; set; }
  public int? Material { get; set; }
  public string? Variant { get; set; } = string.Empty;
  public string? Notes { get; set; }
  [Range(1, 9999, ErrorMessage = "Length must be 1 or more")]
  public decimal? Length { get; set; }
  [Range(1, 9999, ErrorMessage = "Width must be 1 or more")]
  public decimal? Width { get; set; }
  [Range(1, 9999, ErrorMessage = "Height must be 1 or more")]
  public decimal? Height { get; set; }  
  [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative")]
  public decimal? UnitPrice { get; set; }
}