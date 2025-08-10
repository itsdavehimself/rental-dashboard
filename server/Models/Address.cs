namespace server.Models;

public class Address
{
  public string Street { get; set; } = string.Empty;
  public string? Unit { get; set; }
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string ZipCode { get; set; } = string.Empty;
}