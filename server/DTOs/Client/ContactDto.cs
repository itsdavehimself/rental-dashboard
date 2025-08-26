namespace server.Dtos.Clients;

public class ContactDto
{
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public string Role { get; set; } = string.Empty;
  public bool IsPrimary { get; set; }
}