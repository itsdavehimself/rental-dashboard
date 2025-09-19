using System.Globalization;
using System.Text.RegularExpressions;

public static class AddressFormatter
{
    private static string FixOrdinals(string input)
    {
        return Regex.Replace(input, @"\b(\d+)(St|Nd|Rd|Th)\b", m =>
        {
            var num = m.Groups[1].Value;
            var suffix = m.Groups[2].Value.ToLower();

            switch (suffix)
            {
                case "st": return num + "st";
                case "nd": return num + "nd";
                case "rd": return num + "rd";
                case "th": return num + "th";
                default: return m.Value;
            }
        }, RegexOptions.IgnoreCase);
    }
    private static readonly TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;

    private static readonly string[] alwaysCaps =
    {
        "NW", "NE", "SW", "SE",
        "N", "S", "E", "W",
        "PO", "BOX",
        "LLC", "INC", "USA"
    };

    public static string ToProperCase(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return input;

        var titled = textInfo.ToTitleCase(input.ToLower());

        foreach (var word in alwaysCaps)
        {
            titled = Regex.Replace(
                titled,
                $@"\b{word}\b",
                word,
                RegexOptions.IgnoreCase);
        }

        titled = FixOrdinals(titled);

        return titled;
    }
}
