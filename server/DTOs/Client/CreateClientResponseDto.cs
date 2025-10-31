using server.DTOs.Address;

namespace server.DTOs.Client;

public class CreateClientResponseDto
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

  public string? Notes { get; set; }
  public DateTime CreatedAt { get; set; }

  public AddressDto? BillingAddress { get; set; }
  public AddressDto? DeliveryAddress { get; set; }
}
