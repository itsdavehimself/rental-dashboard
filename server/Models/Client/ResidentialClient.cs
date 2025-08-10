namespace server.Models.Client;

public class ResidentialClient
{
  public int Id { get; set; }
  public int Uid { get; set; }
  public Client Client { get; set; } = null!;
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public Address Address { get; set; } = new Address();
}