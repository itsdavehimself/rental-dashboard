using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddInventorySeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 2, "Black", "BLK" });

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 3,
                column: "InventorySubTypeId",
                value: 1);

            migrationBuilder.InsertData(
                table: "InventoryColors",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 4, 2, null, "White", "WHT" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 2, "Plastic", "PLT" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "Resin", "RSN" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 1, "Metal", "MTL" });

            migrationBuilder.InsertData(
                table: "InventoryMaterials",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 5, 3, null, "Vinyl", "VNL" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 2, "Folding", "FLD" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "Canopy", "CNP" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 3, "Pole", "POL" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "MechanicalBull", "MBL" });

            migrationBuilder.InsertData(
                table: "InventorySubTypes",
                columns: new[] { "Id", "InventoryTypeId", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 6, 5, "BounceHouse", "BNC" },
                    { 7, 4, "String", "STR" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 1, "White", "WHT" });

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 3,
                column: "InventorySubTypeId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 1, "Resin", "RSN" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "Metal", "MTL" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "InventorySubTypeId", "Name", "SkuCode" },
                values: new object[] { 3, "Vinyl", "VNL" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 3, "Canopy", "CNP" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "Pole", "POL" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "InventoryTypeId", "Name", "SkuCode" },
                values: new object[] { 5, "MechanicalBull", "MBL" });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Name", "SkuCode" },
                values: new object[] { "BounceHouse", "BNC" });
        }
    }
}
