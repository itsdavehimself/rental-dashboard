namespace server.DTOs;
using System.ComponentModel.DataAnnotations;


using server.Validators;

public class UpdateUserDto
{
  [MinLength(2)]
  public string? FirstName { get; set; }
  [MinLength(2)]
  public string? LastName { get; set; }
  [EmailAddress]
  public string? Email { get; set; }
  [Phone]
  public string? PhoneNumber { get; set; }
  [Range(1, 2, ErrorMessage = "RoleId must be a positive number.")]
  public int? RoleId { get; set; }
  [Range(1, 2, ErrorMessage = "JobTitleId must be a positive number.")]
  public int? JobTitleId { get; set; }
  public bool? IsActive { get; set; }
  [ValidStartDate]
  public DateTime? StartDate { get; set; }
}