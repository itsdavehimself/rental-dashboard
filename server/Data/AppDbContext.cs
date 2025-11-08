using Microsoft.EntityFrameworkCore;
using server.Models.User;
using server.Models;
using server.Models.Inventory;
using server.Models.Event;
using server.Data.Seed;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Role> Roles => Set<Role>();
  public DbSet<Permission> Permissions => Set<Permission>();
  public DbSet<JobTitle> JobTitles => Set<JobTitle>();
  public DbSet<Client> Clients => Set<Client>();
  public DbSet<ClientAddress> ClientAddresses => Set<ClientAddress>();
  public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
  public DbSet<InventoryPurchase> InventoryPurchases => Set<InventoryPurchase>();
  public DbSet<InventoryRetirement> InventoryRetirements => Set<InventoryRetirement>();
  public DbSet<InventoryType> InventoryTypes => Set<InventoryType>();
  public DbSet<InventorySubType> InventorySubTypes => Set<InventorySubType>();
  public DbSet<InventoryMaterial> InventoryMaterials => Set<InventoryMaterial>();
  public DbSet<InventoryColor> InventoryColors => Set<InventoryColor>();
  public DbSet<BounceHouseType> BounceHouseTypes => Set<BounceHouseType>();
  public DbSet<Event> Events => Set<Event>();
  public DbSet<EventItem> EventItems => Set<EventItem>();
  public DbSet<LogisticsTask> LogisticsTasks => Set<LogisticsTask>();
  public DbSet<Package> Packages => Set<Package>();
  public DbSet<PackageItem> PackageItems => Set<PackageItem>();
  public DbSet<TaxJurisdiction> TaxJurisdictions => Set<TaxJurisdiction>();
  public DbSet<Payment> Payments => Set<Payment>();
  public DbSet<Discount> Discounts => Set<Discount>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Role>()
      .HasMany(r => r.Permissions)
      .WithMany(p => p.Roles)
      .UsingEntity(j => j.ToTable("RolePermissions"));

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

    modelBuilder.Entity<Event>()
      .HasMany(e => e.Items)
      .WithOne(i => i.Event)
      .HasForeignKey(i => i.EventId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Event>()
      .HasMany(e => e.LogisticsTasks)
      .WithOne(t => t.Event)
      .HasForeignKey(t => t.EventId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<PackageItem>()
      .HasOne(pi => pi.Package)
      .WithMany(p => p.Items)
      .HasForeignKey(pi => pi.PackageId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<PackageItem>()
      .HasOne(pi => pi.InventoryItem)
      .WithMany()
      .HasForeignKey(pi => pi.InventoryItemId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<PackageItem>()
      .HasIndex(pi => new { pi.PackageId, pi.InventoryItemId })
      .IsUnique();

    modelBuilder.Entity<TaxJurisdiction>()
      .HasIndex(t => new { t.ZipCode, t.City, t.Address });

    modelBuilder.Entity<TaxJurisdiction>()
      .HasIndex(t => t.LocCode);

    modelBuilder.Entity<TaxJurisdiction>()
      .Property(t => t.HighRate)
      .IsRequired();

    modelBuilder.Entity<Client>()
      .HasMany(c => c.ClientAddresses)
      .WithOne(a => a.Client)
      .HasForeignKey(a => a.ClientId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<ClientAddress>()
      .Property(a => a.Type)
      .HasConversion<string>();

    modelBuilder.Entity<ClientAddress>()
      .HasIndex(a => a.Uid)
      .IsUnique();

    modelBuilder.Entity<Payment>()
      .Property(p => p.Method)
      .HasConversion<string>();

    modelBuilder.Entity<Payment>()
      .HasIndex(p => p.Uid)
      .IsUnique();

    modelBuilder.Entity<Event>()
      .Property(e => e.Status)
      .HasConversion<string>();

    modelBuilder.Entity<Event>()
      .HasMany(e => e.Payments)
      .WithOne(p => p.Event)
      .HasForeignKey(p => p.EventId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Event>()
      .HasMany(e => e.Discounts)
      .WithOne()
      .HasForeignKey(d => d.EventId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Discount>()
      .Property(d => d.Type)
      .HasConversion<string>();

    InventoryConfigSeeder.Seed(modelBuilder);
  }
}