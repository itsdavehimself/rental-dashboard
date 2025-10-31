namespace server.DTOs.ClientProfile;
public class ClientProfileDto
{
  public Guid Uid { get; set; }
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string AddressLine1 { get; set; } = string.Empty;
  public string? AddressLine2 { get; set; }
  public string City { get; set; } = string.Empty;
  public string State { get; set; } = string.Empty;
  public string ZipCode { get; set; } = string.Empty;
  public bool IsPrimary { get; set; }
}