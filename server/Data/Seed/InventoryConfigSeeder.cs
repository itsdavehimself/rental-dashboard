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
      // Tables & Chairs
      new InventorySubType { Id = 1, Name = "Folding", Label = "Folding", InventoryTypeId = 1, SkuCode = "FLD" },
      new InventorySubType { Id = 2, Name = "Folding", Label = "Folding", InventoryTypeId = 2, SkuCode = "FLD" },
      
      // Tents
      new InventorySubType { Id = 3, Name = "Canopy", Label = "Canopy / Pop-Up", InventoryTypeId = 3, SkuCode = "CNP" },
      new InventorySubType { Id = 4, Name = "Pole", Label = "Pole Tent", InventoryTypeId = 3, SkuCode = "POL" },
      new InventorySubType { Id = 8, Name = "Frame", Label = "Frame Tent", InventoryTypeId = 3, SkuCode = "FRM" },
      
      // Attractions
      new InventorySubType { Id = 5, Name = "MechanicalBull", Label = "Mechanical Bull", InventoryTypeId = 5, SkuCode = "MBL" },
      new InventorySubType { Id = 6, Name = "Inflatable", Label = "Inflatable / Bounce House", InventoryTypeId = 5, SkuCode = "INF" },
      
      // Lighting
      new InventorySubType { Id = 7, Name = "String", Label = "String Lights", InventoryTypeId = 4, SkuCode = "STR" }
    );

    modelBuilder.Entity<InventoryColor>().HasData(
      // Chair/Table Colors
      new InventoryColor { Id = 1, Name = "Black", Label = "Black", InventorySubTypeId = 1, SkuCode = "BLK" },
      new InventoryColor { Id = 2, Name = "Black", Label = "Black", InventorySubTypeId = 2, SkuCode = "BLK" },
      new InventoryColor { Id = 3, Name = "White", Label = "White", InventorySubTypeId = 1, SkuCode = "WHT" },
      new InventoryColor { Id = 4, Name = "White", Label = "White", InventorySubTypeId = 2, SkuCode = "WHT" },
      
      // Tent Colors (Mapped to Canopy, Pole, and Frame)
      new InventoryColor { Id = 5, Name = "SolidWhite", Label = "Solid White", InventorySubTypeId = 3, SkuCode = "WHT" },
      new InventoryColor { Id = 6, Name = "ClearTop", Label = "Clear Top", InventorySubTypeId = 3, SkuCode = "CLR" },
      new InventoryColor { Id = 7, Name = "SolidWhite", Label = "Solid White", InventorySubTypeId = 4, SkuCode = "WHT" },
      new InventoryColor { Id = 8, Name = "ClearTop", Label = "Clear Top", InventorySubTypeId = 4, SkuCode = "CLR" },
      new InventoryColor { Id = 9, Name = "SolidWhite", Label = "Solid White", InventorySubTypeId = 8, SkuCode = "WHT" },
      new InventoryColor { Id = 10, Name = "ClearTop", Label = "Clear Top", InventorySubTypeId = 8, SkuCode = "CLR" }
    );

    modelBuilder.Entity<InventoryMaterial>().HasData(
      // Chair/Table Materials
      new InventoryMaterial { Id = 1, Name = "Plastic", Label = "Plastic", InventorySubTypeId = 1, SkuCode = "PLT" },
      new InventoryMaterial { Id = 2, Name = "Plastic", Label = "Plastic", InventorySubTypeId = 2, SkuCode = "PLT" },
      new InventoryMaterial { Id = 3, Name = "Resin", Label = "Resin", InventorySubTypeId = 1, SkuCode = "RSN" },
      new InventoryMaterial { Id = 4, Name = "Metal", Label = "Metal", InventorySubTypeId = 1, SkuCode = "MTL" },
      
      // Tent Materials (Mapped to Canopy, Pole, and Frame)
      new InventoryMaterial { Id = 5, Name = "Vinyl", Label = "Standard Vinyl", InventorySubTypeId = 3, SkuCode = "VNL" },
      new InventoryMaterial { Id = 6, Name = "Vinyl", Label = "Standard Vinyl", InventorySubTypeId = 4, SkuCode = "VNL" },
      new InventoryMaterial { Id = 7, Name = "Vinyl", Label = "Standard Vinyl", InventorySubTypeId = 8, SkuCode = "VNL" },
      new InventoryMaterial { Id = 8, Name = "Sailcloth", Label = "Sailcloth", InventorySubTypeId = 4, SkuCode = "SCL" } 
    );

    modelBuilder.Entity<BounceHouseType>().HasData(
      // Note: Re-assigned InventorySubTypeId to 6 (Inflatable)
      new BounceHouseType { Id = 1, Name = "StandardCastle", Label = "Standard Castle", InventorySubTypeId = 6 },
      new BounceHouseType { Id = 2, Name = "Combo", Label = "Combo (Jump & Slide)", InventorySubTypeId = 6 },
      new BounceHouseType { Id = 3, Name = "WaterSlide", Label = "Water Slide", InventorySubTypeId = 6 },
      new BounceHouseType { Id = 4, Name = "ObstacleCourse", Label = "Obstacle Course", InventorySubTypeId = 6 },
      new BounceHouseType { Id = 5, Name = "Interactive", Label = "Interactive Game", InventorySubTypeId = 6 }
    );
  }
}