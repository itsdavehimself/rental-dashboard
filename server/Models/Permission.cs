namespace server.Models;

public class Permission
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public List<Role> Roles { get; set; } = [];
}