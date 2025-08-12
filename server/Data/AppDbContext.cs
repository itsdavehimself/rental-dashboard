using Microsoft.EntityFrameworkCore;
using server.Models.User;
using server.Models.Client;
using server.Models.Inventory;
public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Role> Roles => Set<Role>();
  public DbSet<Permission> Permissions => Set<Permission>();
  public DbSet<JobTitle> JobTitles => Set<JobTitle>();
  public DbSet<Client> Clients => Set<Client>();
  public DbSet<ResidentialClient> ResidentialClients => Set<ResidentialClient>();
  public DbSet<BusinessClient> BusinessClients => Set<BusinessClient>();
  public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Role>()
        .HasMany(r => r.Permissions)
        .WithMany(p => p.Roles)
        .UsingEntity(j => j.ToTable("RolePermissions"));

    modelBuilder.Entity<Client>()
        .HasOne(c => c.ResidentialClient)
        .WithOne(rc => rc.Client)
        .HasForeignKey<ResidentialClient>(rc => rc.ClientId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Client>()
        .HasOne(c => c.BusinessClient)
        .WithOne(rc => rc.Client)
        .HasForeignKey<BusinessClient>(rc => rc.ClientId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<ResidentialClient>()
      .OwnsOne(rc => rc.Address);

    modelBuilder.Entity<BusinessClient>()
      .HasMany(bc => bc.Contacts)
      .WithOne(c => c.BusinessClient)
      .HasForeignKey(c => c.BusinessClientId)
      .OnDelete(DeleteBehavior.Cascade);
  }
}