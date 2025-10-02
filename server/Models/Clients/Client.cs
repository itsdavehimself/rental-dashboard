namespace server.Models.Clients;

public enum ClientType
{
  Residential,
  Business
}
public class Client
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public ClientType Type { get; set; }
  public string? Notes { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public ResidentialClient? ResidentialClient { get; set; }
  public BusinessClient? BusinessClient { get; set; }
  public List<ClientAddressBookEntry> AddressBookEntries { get; set; } = [];
}