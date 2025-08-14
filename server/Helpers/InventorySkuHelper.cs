using server.Models.Inventory;

namespace server.Helpers;

public static class InventorySkuHelper
{
  public static string GenerateSku(InventoryItem i, string? suffix = null)
  {
    if (string.IsNullOrWhiteSpace(i.Type?.SkuCode)) throw new ArgumentException("Missing Type SKU Code");
    if (string.IsNullOrWhiteSpace(i.SubType?.SkuCode)) throw new ArgumentException("Missing SubType SKU Code");
    if (string.IsNullOrWhiteSpace(i.Color?.SkuCode)) throw new ArgumentException("Missing Color SKU Code");

    var parts = new List<string>
    {
      i.Type.SkuCode,
      i.SubType.SkuCode,
      i.Color.SkuCode
    };

    var size = FormatSize(i.Length, i.Width);
    if (size is not null) parts.Add(size);

    if (!string.IsNullOrWhiteSpace(i.Material?.SkuCode))
      parts.Add(i.Material.SkuCode);

    if (!string.IsNullOrWhiteSpace(suffix))
      parts.Add(SanitizeSuffix(suffix));

    return string.Join("-", parts);
  }
  
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