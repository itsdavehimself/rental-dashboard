using server.Models.Inventory;

namespace server.Helpers;

public static class InventorySkuHelper
{
    public static string GenerateSku(InventoryItem item, string? suffix = null)
    {
        var prefix = string.IsNullOrWhiteSpace(item.Type?.SkuCode) 
            ? "INV" 
            : Sanitize(item.Type.SkuCode);

        var uniqueHash = item.Uid.ToString("N").Substring(0, 6).ToUpperInvariant();

        var sku = $"{prefix}-{uniqueHash}";

        if (!string.IsNullOrWhiteSpace(suffix))
        {
            sku += $"-{Sanitize(suffix)}";
        }

        return sku;
    }

    private static string Sanitize(string s)
    {
        var upper = s.Trim().ToUpperInvariant();
        return new string(upper.Where(ch => char.IsLetterOrDigit(ch)).ToArray());
    }

    public static bool TryParseSku(string sku, out string[] parts)
    {
        parts = sku.Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return parts.Length >= 2;
    }
}