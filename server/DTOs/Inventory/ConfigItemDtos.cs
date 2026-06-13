using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Inventory;

public class CreateTypeDto
{
    [Required] public string Label { get; set; } = string.Empty;
    [Required] [MaxLength(3)] public string SkuCode { get; set; } = string.Empty;
}

public class CreateSubTypeDto
{
    [Required] public int InventoryTypeId { get; set; }
    [Required] public string Label { get; set; } = string.Empty;
    [Required] [MaxLength(3)] public string SkuCode { get; set; } = string.Empty;
}

public class CreateAttributeDto
{
    [Required] public int InventorySubTypeId { get; set; }
    [Required] public string Label { get; set; } = string.Empty;
    [MaxLength(3)] public string? SkuCode { get; set; }
}

public class UpdateConfigItemDto
{
    [Required] public string Label { get; set; } = string.Empty;
    [MaxLength(3)] public string? SkuCode { get; set; }
}