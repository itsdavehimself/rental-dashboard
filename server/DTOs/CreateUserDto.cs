using System.ComponentModel.DataAnnotations;

namespace server.DTOs;

public class CreateUserDto
{
  [Required]
  [MinLength(2)]
  public string FirstName { get; set; } = string.Empty;
  [Required]
  [MinLength(2)]
  public string LastName { get; set; } = string.Empty;
  [Required]
  [EmailAddress]
  public string Email { get; set; } = string.Empty;
  [Required]
  [Phone]
  public string PhoneNumber { get; set; } = string.Empty;
  [Required]
  [MinLength(8)]
  [MaxLength(24)]
  public string Password { get; set; } = string.Empty;
  [Required]
  [Range(1, 2, ErrorMessage = "RoleId must be a positive number.")]
  public int RoleId { get; set; }
}