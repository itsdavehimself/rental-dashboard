using server.Models.Inventory;
using Microsoft.EntityFrameworkCore;

namespace server.Data.Seed;

public static class InventoryConfigSeeder
{
  public static void Seed(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<InventoryType>().HasData(
      new InventoryType { Id = 1, Name = "Table", SkuCode = "TAB" },
      new InventoryType { Id = 2, Name = "Chair", SkuCode = "CHA" },
      new InventoryType { Id = 3, Name = "Tent", SkuCode = "TNT" },
      new InventoryType { Id = 4, Name = "Lighting", SkuCode = "LGT" },
      new InventoryType { Id = 5, Name = "Attraction", SkuCode = "ATR" }
    );

    modelBuilder.Entity<InventorySubType>().HasData(
      new InventorySubType { Id = 1, Name = "Folding", InventoryTypeId = 1, SkuCode = "FLD" },
      new InventorySubType { Id = 2, Name = "Canopy", InventoryTypeId = 3, SkuCode = "CNP" },
      new InventorySubType { Id = 3, Name = "Pole", InventoryTypeId = 3, SkuCode = "POL" },
      new InventorySubType { Id = 4, Name = "MechanicalBull", InventoryTypeId = 5, SkuCode = "MBL" },
      new InventorySubType { Id = 5, Name = "BounceHouse", InventoryTypeId = 5, SkuCode = "BNC" }
    );

    modelBuilder.Entity<InventoryColor>().HasData(
      new InventoryColor { Id = 1, Name = "Black", InventorySubTypeId = 1, SkuCode = "BLK" },
      new InventoryColor { Id = 2, Name = "White", InventorySubTypeId = 1, SkuCode = "WHT" },
      new InventoryColor { Id = 3, Name = "White", InventorySubTypeId = 2, SkuCode = "WHT" }
    );

    modelBuilder.Entity<InventoryMaterial>().HasData(
      new InventoryMaterial { Id = 1, Name = "Plastic", InventorySubTypeId = 1, SkuCode = "PLT" },
      new InventoryMaterial { Id = 2, Name = "Resin", InventorySubTypeId = 1, SkuCode = "RSN" },
      new InventoryMaterial { Id = 3, Name = "Metal", InventorySubTypeId = 1, SkuCode = "MTL" },
      new InventoryMaterial { Id = 4, Name = "Vinyl", InventorySubTypeId = 3, SkuCode = "VNL" }
    );

    modelBuilder.Entity<BounceHouseType>().HasData(
      new BounceHouseType { Id = 1, Name = "Dolphin", InventorySubTypeId = 5 },
      new BounceHouseType { Id = 2, Name = "Spongebob", InventorySubTypeId = 5 }
    );
  }
}
