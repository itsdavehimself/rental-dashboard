using System.ComponentModel.DataAnnotations;

namespace server.DTOs.ResidentialClient;

public class ResidentialClientCreateDto
{
  [Required(ErrorMessage = "First name is required")]
  [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
  [RegularExpression(@"^[A-Za-z\-\'\s]+$", ErrorMessage = "First name has invalid characters")]
  public string FirstName { get; set; } = string.Empty;
  [Required(ErrorMessage = "Last name is required")]
  [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
  [RegularExpression(@"^[A-Za-z\-\'\s]+$", ErrorMessage = "Last name has invalid characters")]
  public string LastName { get; set; } = string.Empty;
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Email is not in a valid format")]
  public string Email { get; set; } = string.Empty;
  [Required(ErrorMessage = "Phone number is required")]
  public string PhoneNumber { get; set; } = string.Empty;
  public AddressDto Address { get; set; } = new();
  public string? Notes { get; set; }
}