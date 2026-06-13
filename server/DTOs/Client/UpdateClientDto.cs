using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Client;

public class UpdateClientDto
{
    public ClientType? Type { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public string? BusinessName { get; set; }
    public bool? IsTaxExempt { get; set; }
    public bool? IsLegacy { get; set; }

    public string? Notes { get; set; }
}