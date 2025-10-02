namespace server.DTOs.Address;

public class AddressBookEntryDto
{
  public string FullName { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public string Street { get; set; } = string.Empty;
  public string? Unit { get; set; }
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string ZipCode { get; set; } = string.Empty;
  public bool IsPrimary { get; set; }
}