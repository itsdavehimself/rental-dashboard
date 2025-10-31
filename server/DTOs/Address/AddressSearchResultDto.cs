namespace server.DTOs.Address;

public class AddressSearchResultDto
{
  public int Id { get; set; }
  public string AddressLine1 { get; set; } = string.Empty;
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string ZipCode { get; set; } = string.Empty;
}