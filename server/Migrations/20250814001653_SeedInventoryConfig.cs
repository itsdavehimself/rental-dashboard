using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SeedInventoryConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "InventoryTypes",
                columns: new[] { "Id", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 1, "Table", "TAB" },
                    { 2, "Chair", "CHA" },
                    { 3, "Tent", "TNT" },
                    { 4, "Lighting", "LGT" },
                    { 5, "Attraction", "ATR" }
                });

            migrationBuilder.InsertData(
                table: "InventorySubTypes",
                columns: new[] { "Id", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 1, 1, "Folding", "FLD" },
                    { 2, 3, "Canopy", "CNP" },
                    { 3, 3, "Pole", "POL" },
                    { 4, 5, "MechanicalBull", "MBL" },
                    { 5, 5, "BounceHouse", "BNC" }
                });

            migrationBuilder.InsertData(
                table: "BounceHouseTypes",
                columns: new[] { "Id", "InventorySubTypeId", "Name" },
                values: new object[,]
                {
                    { 1, 5, "Dolphin" },
                    { 2, 5, "Spongebob" }
                });

            migrationBuilder.InsertData(
                table: "InventoryColors",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 1, 1, null, "Black", "BLK" },
                    { 2, 1, null, "White", "WHT" },
                    { 3, 2, null, "White", "WHT" }
                });

            migrationBuilder.InsertData(
                table: "InventoryMaterials",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 1, 1, null, "Plastic", "PLT" },
                    { 2, 1, null, "Resin", "RSN" },
                    { 3, 1, null, "Metal", "MTL" },
                    { 4, 3, null, "Vinyl", "VNL" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
