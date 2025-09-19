using System.Text.RegularExpressions;

namespace server.Helpers
{
  public static class AddressNormalizer
  {
    private static readonly Dictionary<string, string> SuffixMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "STREET", "ST" },
        { "ST", "ST" },
        { "ROAD", "RD" },
        { "RD", "RD" },
        { "AVENUE", "AVE" },
        { "AVE", "AVE" },
        { "DRIVE", "DR" },
        { "DR", "DR" },
        { "COURT", "CT" },
        { "CT", "CT" },
        { "LANE", "LN" },
        { "LN", "LN" },
        { "BOULEVARD", "BLVD" },
        { "BLVD", "BLVD" },
        { "PLACE", "PL" },
        { "PL", "PL" },
        { "TERRACE", "TER" },
        { "TER", "TER" }
    };

    public static string Normalize(string street)
    {
      if (string.IsNullOrWhiteSpace(street)) return string.Empty;

      var normalized = street.ToUpperInvariant();

      normalized = Regex.Replace(normalized, @"[.,\-]", " ");

      normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

      var parts = normalized.Split(' ');

      if (parts.Length > 1)
      {
        var last = parts[^1];
        if (SuffixMap.TryGetValue(last, out var mapped))
        {
          parts[^1] = mapped;
        }
      }

      return string.Join(" ", parts);
    }
  }
}