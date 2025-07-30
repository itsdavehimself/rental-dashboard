using Microsoft.EntityFrameworkCore;
using server.Models;
public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Role> Roles => Set<Role>();
  public DbSet<Permission> Permissions => Set<Permission>();
}