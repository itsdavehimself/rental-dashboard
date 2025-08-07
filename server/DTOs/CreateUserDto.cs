using System.ComponentModel.DataAnnotations;
using server.Validators;

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
  [Range(1, 2, ErrorMessage = "JobTitleId must be a positive number.")]
  public int JobTitleId { get; set; }
  [ValidStartDate]
  public DateTime? StartDate { get; set; }
  public decimal PayRate { get; set; }
}