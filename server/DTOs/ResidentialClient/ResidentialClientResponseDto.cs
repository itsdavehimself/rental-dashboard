namespace server.DTOs.ResidentialClient;

public class ResidentialClientResponseDto
{
  public Guid Uid { get; set; }

  public string FirstName { get; set; } = string.Empty;

  public string LastName { get; set; } = string.Empty;

  public string Email { get; set; } = string.Empty;

  public string PhoneNumber { get; set; } = string.Empty;

  public string? Notes { get; set; }

  public DateTime CreatedAt { get; set; }

  public AddressDto? BillingAddress { get; set; } = new();
  public AddressDto? DeliveryAddress { get; set; } = new();
}
