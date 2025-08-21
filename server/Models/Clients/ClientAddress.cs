namespace server.Models.Clients;

public class ClientAddress
{
  public int Id { get; set; }
  public int ClientId { get; set; }
  public Client Client { get; set; } = null!;
  public int AddressId { get; set; }
  public Address Address { get; set; } = null!;
  public AddressType Type { get; set; }
  public string? Label { get; set; }
}

[Flags]
public enum AddressType
{
  None = 0,
  Delivery = 1,
  Billing = 2,
  Both = Delivery | Billing 
}
