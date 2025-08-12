using server.Models.Inventory;

namespace server.Helpers;

public static class InventorySkuHelper
{
  public static readonly Dictionary<InventoryType, string> TypeCodes = new()
  {
    { InventoryType.Table, "TAB" },
    { InventoryType.Chair, "CHA" },
    { InventoryType.Tent, "TNT" },
    { InventoryType.Lighting, "LGT" },
    { InventoryType.Attraction, "ATR" }
  };

  public static readonly Dictionary<InventorySubType, string> SubTypeCodes = new()
  {
    { InventorySubType.Folding, "FLD" },
    { InventorySubType.Canopy, "CNP" },
    { InventorySubType.Pole, "POL" },
    { InventorySubType.MechanicalBull, "MBL" },
    { InventorySubType.BounceHouse, "BNC" }
  };

  public static readonly Dictionary<InventoryColor, string> ColorCodes = new()
  {
    { InventoryColor.Black, "BLK" },
    { InventoryColor.White, "WHT" }
  };

  public static readonly Dictionary<MaterialType, string> MaterialCodes = new()
  {
    { MaterialType.Plastic, "PLT" },
    { MaterialType.Resin,  "RSN" },
    { MaterialType.Metal,  "MTL" },
    { MaterialType.Vinyl,  "VNL" }
  };

  private static readonly Dictionary<InventoryType, HashSet<InventorySubType>> AllowedSubtypes = new()
  {
    { InventoryType.Table, new HashSet<InventorySubType> { InventorySubType.Folding } },
    { InventoryType.Chair, new HashSet<InventorySubType> { InventorySubType.Folding } },
    { InventoryType.Tent,  new HashSet<InventorySubType> { InventorySubType.Canopy, InventorySubType.Pole } },
    { InventoryType.Lighting, new HashSet<InventorySubType>() },
    { InventoryType.Attraction, new HashSet<InventorySubType> { InventorySubType.MechanicalBull, InventorySubType.BounceHouse } },
  };

  private static readonly Dictionary<InventoryType, HashSet<MaterialType>> AllowedMaterials = new()
  {
    { InventoryType.Table, new HashSet<MaterialType> { MaterialType.Plastic, MaterialType.Resin, MaterialType.Metal } },
    { InventoryType.Chair, new HashSet<MaterialType> { MaterialType.Plastic, MaterialType.Resin, MaterialType.Metal } },
    { InventoryType.Tent,  new HashSet<MaterialType> { MaterialType.Vinyl } },
    { InventoryType.Lighting, new HashSet<MaterialType>() },
    { InventoryType.Attraction, new HashSet<MaterialType>() },
  };

  public static string GenerateSku(InventoryItem i, string? suffix = null)
    => GenerateSku(i.Type, i.SubType, i.Color, i.Material, i.Length, i.Width, suffix);

  public static string GenerateSku(
    InventoryType type,
    InventorySubType subType,
    InventoryColor color,
    MaterialType? material = null,
    int? length = null,
    int? width  = null,
    string? suffix = null
  )
  {
    if (!AllowedSubtypes.TryGetValue(type, out var set) || (set.Count > 0 && !set.Contains(subType)))
      throw new ArgumentOutOfRangeException(nameof(subType), $"Subtype {subType} not allowed for {type}");

    if (material.HasValue && AllowedMaterials.TryGetValue(type, out var mats) && mats.Count > 0 && !mats.Contains(material.Value))
      throw new ArgumentOutOfRangeException(nameof(material), $"Material {material} not allowed for {type}");

    var parts = new List<string>(6)
    {
      CodeOrThrow(TypeCodes, type, nameof(type)),
      CodeOrThrow(SubTypeCodes, subType, nameof(subType)),
      CodeOrThrow(ColorCodes, color, nameof(color))
    };

    var size = FormatSize(length, width);
    if (size is not null) parts.Add(size);

    if (material.HasValue)
      parts.Add(CodeOrThrow(MaterialCodes, material.Value, nameof(material)));

    if (!string.IsNullOrWhiteSpace(suffix))
      parts.Add(SanitizeSuffix(suffix));

    return string.Join("-", parts);
  }

  private static string CodeOrThrow<T>(Dictionary<T, string> map, T key, string paramName) where T : notnull
    => map.TryGetValue(key, out var code) ? code : throw new ArgumentOutOfRangeException(paramName, $"Missing code for {key}");

  private static string? FormatSize(int? length, int? width)
  {
    if (!length.HasValue || !width.HasValue) return null;

    var L = Math.Max(length.Value, width.Value);
    var W = Math.Min(length.Value, width.Value);

    string fmt(int v) => v >= 100 ? v.ToString() : v.ToString("00");
    return $"{fmt(L)}X{fmt(W)}";
  }

  private static string SanitizeSuffix(string s)
  {
    var upper = s.Trim().ToUpperInvariant();
    return new string(upper.Where(ch => char.IsLetterOrDigit(ch)).ToArray());
  }

  public static bool TryParseSku(string sku, out string[] parts)
  {
    parts = sku.Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    return parts.Length >= 3;
  }
}