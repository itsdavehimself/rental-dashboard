namespace server.DTOs;

public class UpdateUserDto
{
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public string? PhoneNumber { get; set; }
  public int? RoleId { get; set; }
  public int? JobTitleId { get; set; }
  public bool? IsActive { get; set; }
}