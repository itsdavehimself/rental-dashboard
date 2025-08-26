namespace server.Models.Clients;

public class ContactPerson
{
  public int Id { get; set; }
  public int BusinessClientId { get; set; }
  public BusinessClient BusinessClient { get; set; } = null!;
  public int PersonId { get; set; }
  public Person Person { get; set; } = new();
  public string Role { get; set; } = string.Empty;
  public bool IsPrimary { get; set; } = false;
}