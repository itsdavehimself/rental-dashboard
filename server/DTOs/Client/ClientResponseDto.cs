using server.Models.Clients;
using server.DTOs.Address;

namespace server.Dtos.Clients;

public class ClientResponseDto
{
  public Guid Uid { get; set; }
  public ClientType Type { get; set; }

  // For ResidentialClient
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public string? PhoneNumber { get; set; }

  // For BusinessClient
  public string? BusinessName { get; set; }
  public bool? IsTaxExempt { get; set; }
  public List<ContactDto>? Contacts { get; set; }

  public string? Notes { get; set; }
  public DateTime CreatedAt { get; set; }

  public List<AddressBookEntryDto>? BillingAddresses { get; set; }
  public List<AddressBookEntryDto>? DeliveryAddresses { get; set; }
}
