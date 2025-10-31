using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Client;

public class ClientAddressCreateDto
{
  [Required(ErrorMessage = "First name is required")]
  [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
  [RegularExpression(@"^[A-Za-z\-\'\s]+$", ErrorMessage = "First name has invalid characters")]
  public string FirstName { get; set; } = string.Empty;
  [Required(ErrorMessage = "Last name is required")]
  [MinLength(2, ErrorMessage = "Last name must be at least 2 characters")]
  [RegularExpression(@"^[A-Za-z\-\'\s]+$", ErrorMessage = "Last name has invalid characters")]
  public string LastName { get; set; } = string.Empty;
  [Required(ErrorMessage = "Phone number is required")]
  public string PhoneNumber { get; set; } = string.Empty;
  public string? Email { get; set; } = string.Empty;
  [Required(ErrorMessage = "Street address is required")]

  public string AddressLine1 { get; set; } = string.Empty;
  public string? AddressLine2 { get; set; }
  [Required(ErrorMessage = "City is required")]
  public string City { get; set; } = string.Empty;
  [Required(ErrorMessage = "State is required")]
  public string State { get; set; } = string.Empty;
  [Required(ErrorMessage = "Zip code is required")]
  [RegularExpression(@"^\d{5}(-\d{4})?$", ErrorMessage = "Invalid ZIP code")]
  public string ZipCode { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string? Label { get; set; }
  public string? Role { get; set; }
  public bool IsPrimary { get; set; }
}