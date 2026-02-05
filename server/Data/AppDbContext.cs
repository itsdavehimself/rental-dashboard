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
    public DbSet<InventoryComponent> InventoryComponents => Set<InventoryComponent>();
    public DbSet<InventoryPurchase> InventoryPurchases => Set<InventoryPurchase>();
    public DbSet<InventoryRetirement> InventoryRetirements => Set<InventoryRetirement>();
    public DbSet<InventoryType> InventoryTypes => Set<InventoryType>();
    public DbSet<InventorySubType> InventorySubTypes => Set<InventorySubType>();
    public DbSet<InventoryMaterial> InventoryMaterials => Set<InventoryMaterial>();
    public DbSet<InventoryColor> InventoryColors => Set<InventoryColor>();
    public DbSet<BounceHouseType> BounceHouseTypes => Set<BounceHouseType>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventItem> EventItems => Set<EventItem>();
    public DbSet<LogisticsTrip> LogisticsTrips => Set<LogisticsTrip>();
    public DbSet<LogisticsWorkItem> LogisticsWorkItems => Set<LogisticsWorkItem>();
    public DbSet<LogisticsAssignment> LogisticsAssignments => Set<LogisticsAssignment>();
    public DbSet<Package> Packages => Set<Package>();
    public DbSet<PackageItem> PackageItems => Set<PackageItem>();
    public DbSet<TaxJurisdiction> TaxJurisdictions => Set<TaxJurisdiction>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Discount> Discounts => Set<Discount>();
    public DbSet<Truck> Trucks => Set<Truck>();
    public DbSet<CrewPreset> CrewPresets => Set<CrewPreset>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- AUTH & ROLES ---
        modelBuilder.Entity<Role>()
          .HasMany(r => r.Permissions)
          .WithMany(p => p.Roles)
          .UsingEntity(j => j.ToTable("RolePermissions"));

        // --- INVENTORY ---
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

        modelBuilder.Entity<InventoryComponent>(entity =>
          {
              entity.HasKey(ic => ic.Id);
              entity.HasOne(ic => ic.ParentItem)
                  .WithMany(i => i.Components)
                  .HasForeignKey(ic => ic.ParentItemId)
                  .OnDelete(DeleteBehavior.Cascade);
              entity.HasOne(ic => ic.ChildItem)
                  .WithMany(i => i.ParentItems)
                  .HasForeignKey(ic => ic.ChildItemId)
                  .OnDelete(DeleteBehavior.Restrict); 
              entity.HasIndex(ic => new { ic.ParentItemId, ic.ChildItemId }).IsUnique();
          });

        // --- PACKAGES ---
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

        // --- CLIENTS & TAX ---
        modelBuilder.Entity<TaxJurisdiction>()
          .HasIndex(t => new { t.ZipCode, t.City, t.Address });

        modelBuilder.Entity<TaxJurisdiction>().HasIndex(t => t.LocCode);
        modelBuilder.Entity<TaxJurisdiction>().Property(t => t.HighRate).IsRequired();

        modelBuilder.Entity<Client>()
          .HasMany(c => c.ClientAddresses)
          .WithOne(a => a.Client)
          .HasForeignKey(a => a.ClientId)
          .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ClientAddress>().Property(a => a.Type).HasConversion<string>();
        modelBuilder.Entity<ClientAddress>().HasIndex(a => a.Uid).IsUnique();

        // --- EVENTS & TRANSACTIONS ---
        modelBuilder.Entity<Event>()
          .HasMany(e => e.Items)
          .WithOne(i => i.Event)
          .HasForeignKey(i => i.EventId)
          .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Event>().Property(e => e.Status).HasConversion<string>();

        modelBuilder.Entity<Event>()
          .HasMany(e => e.Transactions)
          .WithOne(t => t.Event)
          .HasForeignKey(t => t.EventId)
          .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Event>()
          .HasMany(e => e.Discounts)
          .WithOne()
          .HasForeignKey(d => d.EventId)
          .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>().Property(t => t.Method).HasConversion<string>();
        modelBuilder.Entity<Transaction>().Property(t => t.Type).HasConversion<string>();
        modelBuilder.Entity<Transaction>().HasIndex(t => t.Uid).IsUnique();
        modelBuilder.Entity<Discount>().Property(d => d.Type).HasConversion<string>();

        // --- NEW LOGISTICS CONFIGURATION ---

        // 1. Event to Trip
        modelBuilder.Entity<Event>()
          .HasMany(e => e.LogisticsTrips)
          .WithOne(t => t.Event)
          .HasForeignKey(t => t.EventId)
          .OnDelete(DeleteBehavior.Cascade);

        // 2. Trip to WorkItems
        modelBuilder.Entity<LogisticsTrip>()
          .HasMany(t => t.WorkItems)
          .WithOne(w => w.LogisticsTrip)
          .HasForeignKey(w => w.LogisticsTripId)
          .OnDelete(DeleteBehavior.Cascade);

        // 3. Trip to Crew Assignments
        modelBuilder.Entity<LogisticsTrip>()
          .HasMany(t => t.Crew)
          .WithOne(a => a.LogisticsTrip)
          .HasForeignKey(a => a.LogisticsTripId)
          .OnDelete(DeleteBehavior.Cascade);

        // 4. Assignment to User
        modelBuilder.Entity<LogisticsAssignment>()
          .HasOne(a => a.User)
          .WithMany()
          .HasForeignKey(a => a.UserId)
          .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Truck>()
          .HasMany(t => t.Trips)
          .WithOne(trip => trip.Truck)
          .HasForeignKey(trip => trip.TruckId)
          .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LogisticsTrip>()
          .HasIndex(t => new { t.TruckId, t.ScheduledStart, t.ScheduledEnd });

        // --- CREW PRESETS ---
        modelBuilder.Entity<CrewPreset>(entity =>
        {
            entity.HasIndex(e => e.Uid).IsUnique();

            // 1. Truck Relationship (Updated to use p.Truck)
            entity.HasOne(p => p.Truck) 
                  .WithMany() 
                  .HasForeignKey(p => p.TruckId)
                  .OnDelete(DeleteBehavior.Restrict);

            // 2. Lead User Relationship
            entity.HasOne<User>()
                  .WithMany()
                  .HasForeignKey(p => p.LeadId)
                  .OnDelete(DeleteBehavior.Restrict);

            // 3. Crew Members (The Join Table)
            entity.HasMany(p => p.Crew)
                  .WithMany()
                  .UsingEntity(j => j.ToTable("CrewPresetMembers"));
        });

        // Enums and Uids for Logistics
        modelBuilder.Entity<LogisticsTrip>().Property(t => t.Status).HasConversion<string>();
        modelBuilder.Entity<LogisticsTrip>().HasIndex(t => t.Uid).IsUnique();

        modelBuilder.Entity<LogisticsWorkItem>().Property(w => w.Type).HasConversion<string>();
        modelBuilder.Entity<LogisticsWorkItem>().HasIndex(w => w.Uid).IsUnique();

        modelBuilder.Entity<LogisticsAssignment>().HasIndex(a => a.Uid).IsUnique();

        InventoryConfigSeeder.Seed(modelBuilder);
    }
}