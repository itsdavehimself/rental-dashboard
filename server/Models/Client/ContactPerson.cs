namespace server.Models.Client;

public class ContactPerson
{
  public int Id { get; set; }
  public int BusinessClientId { get; set; }
  public BusinessClient BusinessClient { get; set; } = null!;
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public string Role { get; set; } = string.Empty;
  public bool IsPrimary { get; set; } = false;
}