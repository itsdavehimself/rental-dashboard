using Microsoft.EntityFrameworkCore;
using server.Models.User;
using server.Models.Client;
using server.Models.Inventory;
using server.Data.Seed;
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
  public DbSet<InventoryPurchase> InventoryPurchases => Set<InventoryPurchase>();
  public DbSet<InventoryRetirement> InventoryRetirements => Set<InventoryRetirement>();
  public DbSet<InventoryType> InventoryTypes => Set<InventoryType>();
  public DbSet<InventorySubType> InventorySubTypes => Set<InventorySubType>();
  public DbSet<InventoryMaterial> InventoryMaterials => Set<InventoryMaterial>();
  public DbSet<InventoryColor> InventoryColors => Set<InventoryColor>();
  public DbSet<BounceHouseType> BounceHouseTypes => Set<BounceHouseType>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

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

    modelBuilder.Entity<InventoryPurchase>()
      .HasOne(p => p.InventoryItem)
      .WithMany(i => i.Purchases)
      .HasForeignKey(p => p.InventoryItemId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<InventoryRetirement>()
      .HasOne(r => r.InventoryItem)
      .WithMany(i => i.Retirements)
      .HasForeignKey(r => r.InventoryItemId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<InventorySubType>()
      .HasOne(st => st.InventoryType)
      .WithMany(t => t.SubTypes)
      .HasForeignKey(st => st.InventoryTypeId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<InventoryMaterial>()
      .HasOne(m => m.InventorySubType)
      .WithMany(st => st.Materials)
      .HasForeignKey(m => m.InventorySubTypeId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<InventoryColor>()
      .HasOne(c => c.InventorySubType)
      .WithMany(st => st.Colors)
      .HasForeignKey(c => c.InventorySubTypeId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<BounceHouseType>()
      .HasOne(b => b.InventorySubType)
      .WithMany(st => st.BounceHouseTypes)
      .HasForeignKey(b => b.InventorySubTypeId)
      .OnDelete(DeleteBehavior.Cascade);

    InventoryConfigSeeder.Seed(modelBuilder);
  }
}