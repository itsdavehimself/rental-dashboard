using System.Text.RegularExpressions;

namespace server.Helpers
{
    public static class CityNormalizer
    {
        private static readonly Dictionary<string, string> RegexReplacements = new()
        {
            { "HTS", "HEIGHTS" },
            { "HGTS", "HEIGHTS" },
            { "HT", "HEIGHT" },
            { "PK", "PARK" },
            { "VLG", "VILLAGE" },
            { "CTR", "CENTER" },
            { "JCT", "JUNCTION" },
            { "LK", "LAKE" },
            { "EST", "ESTATES" },
            { "CRK", "CREEK" },
            { "WDS", "WOODS" },
            { "SPGS", "SPRINGS" },
            { "PT", "POINT" },
            { "PLZ", "PLAZA" },
            { "TRL", "TRAIL" },
            { "CYN", "CANYON" },
            { "HBR", "HARBOR" },
            { "VL", "VALLEY" },
            { "RCH", "RANCH" },
            { "CIR", "CIRCLE" },
            { "MDWS", "MEADOWS" },
            { "BCH", "BEACH" },
            { "CTY", "CITY" },
            { "GRV", "GROVE" },
            { "FRST", "FOREST" }
        };

        private static readonly Dictionary<string, string> DirectReplacements = new()
        {
            { "FOX RV VLY GN", "FOX RIVER VALLEY GARDENS" },
            { "FOX RV VALLEYY GN", "FOX RIVER VALLEY GARDENS" },
            { "ST CHAS", "SAINT CHARLES" },
            { "ST CL", "SAINT CLAIR" },
            { "OAK BRK", "OAK BROOK" },
            { "SPFLD", "SPRINGFIELD" },
            { "LAKE IN THE HLS", "LAKE IN THE HILLS" },
            { "VILLAGE OF LAKEWD", "VILLAGE OF LAKEWOOD" }
        };

        public static string NormalizeCity(string city)
        {
            if (string.IsNullOrWhiteSpace(city)) return string.Empty;

            var normalized = city.ToUpperInvariant();

            // strip punctuation
            normalized = Regex.Replace(normalized, @"[.,'\-]", " ");

            // collapse spaces
            normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

            // saints & mounts
            normalized = Regex.Replace(normalized, @"\bST\b\.?", "SAINT");
            normalized = Regex.Replace(normalized, @"\bMT\b\.?", "MOUNT");

            // directionals
            normalized = Regex.Replace(normalized, @"\bNW\b", "NORTHWEST");
            normalized = Regex.Replace(normalized, @"\bNE\b", "NORTHEAST");
            normalized = Regex.Replace(normalized, @"\bSW\b", "SOUTHWEST");
            normalized = Regex.Replace(normalized, @"\bSE\b", "SOUTHEAST");
            normalized = Regex.Replace(normalized, @"\bN\b", "NORTH");
            normalized = Regex.Replace(normalized, @"\bS\b", "SOUTH");
            normalized = Regex.Replace(normalized, @"\bE\b", "EAST");
            normalized = Regex.Replace(normalized, @"\bW\b", "WEST");

            // smart abbreviation cleanup
            foreach (var kvp in RegexReplacements)
            {
                normalized = Regex.Replace(normalized, $@"\b{kvp.Key}\b", kvp.Value);
            }

            // handle specific goblin cases
            foreach (var kvp in DirectReplacements)
            {
                normalized = normalized.Replace(kvp.Key, kvp.Value);
            }

            // final cleanup
            normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

            return normalized;
        }
    }
}
