using server.Models.Inventory;
using Microsoft.EntityFrameworkCore;

namespace server.Data.Seed;

public static class InventoryConfigSeeder
{
  public static void Seed(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<InventoryType>().HasData(
      new InventoryType { Id = 1, Name = "Table", Label = "Table", SkuCode = "TAB" },
      new InventoryType { Id = 2, Name = "Chair", Label = "Chair", SkuCode = "CHA" },
      new InventoryType { Id = 3, Name = "Tent", Label = "Tent", SkuCode = "TNT" },
      new InventoryType { Id = 4, Name = "Lighting", Label = "Lighting", SkuCode = "LGT" },
      new InventoryType { Id = 5, Name = "Attraction", Label = "Attraction", SkuCode = "ATR" }
    );

    modelBuilder.Entity<InventorySubType>().HasData(
      new InventorySubType { Id = 1, Name = "Folding", Label = "Folding", InventoryTypeId = 1, SkuCode = "FLD" },
      new InventorySubType { Id = 2, Name = "Folding", Label = "Folding", InventoryTypeId = 2, SkuCode = "FLD" },
      new InventorySubType { Id = 3, Name = "Canopy", Label = "Canopy", InventoryTypeId = 3, SkuCode = "CNP" },
      new InventorySubType { Id = 4, Name = "Pole", Label = "Pole Tent", InventoryTypeId = 3, SkuCode = "POL" },
      new InventorySubType { Id = 5, Name = "MechanicalBull", Label = "Mechanical Bull", InventoryTypeId = 5, SkuCode = "MBL" },
      new InventorySubType { Id = 6, Name = "BounceHouse", Label = "Bounce House", InventoryTypeId = 5, SkuCode = "BNC" },
      new InventorySubType { Id = 7, Name = "String", Label = "String Lights", InventoryTypeId = 4, SkuCode = "STR" }
    );

    modelBuilder.Entity<InventoryColor>().HasData(
      new InventoryColor { Id = 1, Name = "Black", Label = "Black", InventorySubTypeId = 1, SkuCode = "BLK" },
      new InventoryColor { Id = 2, Name = "Black", Label = "Black", InventorySubTypeId = 2, SkuCode = "BLK" },
      new InventoryColor { Id = 3, Name = "White", Label = "White", InventorySubTypeId = 1, SkuCode = "WHT" },
      new InventoryColor { Id = 4, Name = "White", Label = "White", InventorySubTypeId = 2, SkuCode = "WHT" }
    );

    modelBuilder.Entity<InventoryMaterial>().HasData(
      new InventoryMaterial { Id = 1, Name = "Plastic", Label = "Plastic", InventorySubTypeId = 1, SkuCode = "PLT" },
      new InventoryMaterial { Id = 2, Name = "Plastic", Label = "Plastic", InventorySubTypeId = 2, SkuCode = "PLT" },
      new InventoryMaterial { Id = 3, Name = "Resin", Label = "Resin", InventorySubTypeId = 1, SkuCode = "RSN" },
      new InventoryMaterial { Id = 4, Name = "Metal", Label = "Metal", InventorySubTypeId = 1, SkuCode = "MTL" },
      new InventoryMaterial { Id = 5, Name = "Vinyl", Label = "Vinyl", InventorySubTypeId = 3, SkuCode = "VNL" }
    );

    modelBuilder.Entity<BounceHouseType>().HasData(
      new BounceHouseType { Id = 1, Name = "Dolphin", Label = "Dolphin", InventorySubTypeId = 5 },
      new BounceHouseType { Id = 2, Name = "Spongebob", Label = "Spongebob", InventorySubTypeId = 5 }
    );
  }
}
