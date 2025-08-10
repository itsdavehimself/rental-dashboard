using System.ComponentModel.DataAnnotations;
using server.Validators;

namespace server.DTOs.User;

public class CreateUserDto
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
  [RegularExpression(@"^\d{3}-\d{3}-\d{4}$", ErrorMessage = "Phone number must be in XXX-XXX-XXXX format")]
  public string PhoneNumber { get; set; } = string.Empty;
  [Required]
  [Range(1, 2, ErrorMessage = "Please select a valid role")]
  public int RoleId { get; set; }
  [Range(1, 2, ErrorMessage = "Please select a valid job title")]
  public int JobTitleId { get; set; }
  [Required]
  [ValidStartDate]
  public DateTime? StartDate { get; set; }
  [Required]
  public decimal PayRate { get; set; }
}