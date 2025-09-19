namespace server.Models;
public class TaxJurisdiction
{
  public int Id { get; set; }
  public string Address { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = "IL";
  public string ZipCode { get; set; } = string.Empty;
  public string? ZipCodePlus4 { get; set; }
  public string LocCode { get; set; } = string.Empty;
  public string District { get; set; } = string.Empty;
  public decimal HighRate { get; set; }
  public decimal LowRate { get; set; }
}