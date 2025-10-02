namespace server.Models.Clients;

public class Person
{
  public int Id { get; set; }
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public List<ClientAddressBookEntry> AddressBookEntries { get; set; } = [];
}