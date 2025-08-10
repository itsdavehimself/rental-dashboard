namespace server.DTOs.ResidentialClient;

public class ResidentialClientResponseDto
{
  public Guid ClientId { get; set; }

  public string FirstName { get; set; } = string.Empty;

  public string LastName { get; set; } = string.Empty;

  public string Email { get; set; } = string.Empty;

  public string PhoneNumber { get; set; } = string.Empty;

  public string? Notes { get; set; }

  public DateTime CreatedAt { get; set; }

  public AddressDto Address { get; set; } = new();
}
