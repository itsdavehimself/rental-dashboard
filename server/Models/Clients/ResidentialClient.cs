namespace server.Models.Clients;

public class ResidentialClient
{
  public int Id { get; set; }
  public int ClientId { get; set; }
  public Client Client { get; set; } = null!;
  public int PersonId { get; set; }
  public Person Person { get; set; } = new();
}