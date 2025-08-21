namespace server.Models.Clients;

public class BusinessClient
{
  public int Id { get; set; }
  public int ClientId { get; set; }
  public Client Client { get; set; } = null!;
  public string BusinessName { get; set; } = string.Empty;
  public List<ContactPerson> Contacts { get; set; } = [];
  public bool IsTaxExempt { get; set; }
}