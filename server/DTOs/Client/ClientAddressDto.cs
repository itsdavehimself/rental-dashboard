namespace server.DTOs.Client;

public class ClientAddressDto
{

  public Guid Uid { get; set; } = Guid.NewGuid();
  public string FirstName { get; set; } = "";
  public string LastName { get; set; } = "";
  public string PhoneNumber { get; set; } = "";
  public string Email { get; set; } = "";
  public string? Role { get; set; }
  public string AddressLine1 { get; set; } = "";
  public string? AddressLine2 { get; set; }
  public string City { get; set; } = "";
  public string State { get; set; } = "";
  public string ZipCode { get; set; } = "";
  public bool IsPrimary { get; set; } = false;
  public string? Label { get; set; }
  public ClientAddressType Type { get; set; }
}