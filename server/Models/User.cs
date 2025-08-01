namespace server.Models;

public class User
{
  public int Id { get; set; }
  public Guid Uid { get; set; } = Guid.NewGuid();
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PhoneNumber { get; set; } = string.Empty;
  public string PasswordHash { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime LastModifiedAt { get; set; } = DateTime.UtcNow;
  public int RoleId { get; set; }
  public Role Role { get; set; } = null!;
  public int? JobTitleId { get; set; }
  public JobTitle? JobTitle { get; set; }
  public decimal? CustomPayRate { get; set; }
  public bool IsActive { get; set; } = true;
}