using server.DTOs;
using server.Models.Clients;
public class ClientSearchResultDto
{
  public Guid Uid { get; set; }
  public ClientType Type { get; set; }

  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? BusinessName { get; set; }

  public string? Email { get; set; }
  public string? PhoneNumber { get; set; }
  public string? Notes { get; set; }
  public DateTime CreatedAt { get; set; }
  public AddressDto BillingAddress { get; set; } = new();
}
