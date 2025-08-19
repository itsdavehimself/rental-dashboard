using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Inventory;

public class CreateInventoryPurchaseDto
{
  [Required(ErrorMessage = "Item ID is required")]
  public int InventoryItemId { get; set; }

  [Required(ErrorMessage = "Purchase quantity is required")]
  [Range(1, int.MaxValue, ErrorMessage = "Purchase quantity must be at least 1")]
  public int QuantityPurchased { get; set; }

  [Required(ErrorMessage = "Unit cost is required")]
  [Range(0, double.MaxValue, ErrorMessage = "Unit cost must be a positive number")]
  public decimal UnitCost { get; set; }

  public string? VendorName { get; set; }
}
