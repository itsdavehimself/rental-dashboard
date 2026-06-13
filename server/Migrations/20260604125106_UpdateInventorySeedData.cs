using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInventorySeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "InventorySubTypeId", "Label", "Name" },
                values: new object[] { 6, "Standard Castle", "StandardCastle" });

            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Label", "Name" },
                values: new object[] { 6, "Combo (Jump & Slide)", "Combo" });

            migrationBuilder.InsertData(
                table: "BounceHouseTypes",
                columns: new[] { "Id", "InventorySubTypeId", "Label", "Name" },
                values: new object[,]
                {
                    { 3, 6, "Water Slide", "WaterSlide" },
                    { 4, 6, "Obstacle Course", "ObstacleCourse" },
                    { 5, 6, "Interactive Game", "Interactive" }
                });

            migrationBuilder.InsertData(
                table: "InventoryColors",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Label", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 5, 3, null, "Solid White", "SolidWhite", "WHT" },
                    { 6, 3, null, "Clear Top", "ClearTop", "CLR" },
                    { 7, 4, null, "Solid White", "SolidWhite", "WHT" },
                    { 8, 4, null, "Clear Top", "ClearTop", "CLR" }
                });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 5,
                column: "Label",
                value: "Standard Vinyl");

            migrationBuilder.InsertData(
                table: "InventoryMaterials",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Label", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 6, 4, null, "Standard Vinyl", "Vinyl", "VNL" },
                    { 8, 4, null, "Sailcloth", "Sailcloth", "SCL" }
                });

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "Canopy / Pop-Up");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Label", "Name", "SkuCode" },
                values: new object[] { "Inflatable / Bounce House", "Inflatable", "INF" });

            migrationBuilder.InsertData(
                table: "InventorySubTypes",
                columns: new[] { "Id", "InventoryTypeId", "Label", "Name", "SkuCode" },
                values: new object[] { 8, 3, "Frame Tent", "Frame", "FRM" });

            migrationBuilder.InsertData(
                table: "InventoryColors",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Label", "Name", "SkuCode" },
                values: new object[,]
                {
                    { 9, 8, null, "Solid White", "SolidWhite", "WHT" },
                    { 10, 8, null, "Clear Top", "ClearTop", "CLR" }
                });

            migrationBuilder.InsertData(
                table: "InventoryMaterials",
                columns: new[] { "Id", "InventorySubTypeId", "InventoryTypeId", "Label", "Name", "SkuCode" },
                values: new object[] { 7, 8, null, "Standard Vinyl", "Vinyl", "VNL" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "InventorySubTypeId", "Label", "Name" },
                values: new object[] { 5, "Dolphin", "Dolphin" });

            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "InventorySubTypeId", "Label", "Name" },
                values: new object[] { 5, "Spongebob", "Spongebob" });

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 5,
                column: "Label",
                value: "Vinyl");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "Canopy");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Label", "Name", "SkuCode" },
                values: new object[] { "Bounce House", "BounceHouse", "BNC" });
        }
    }
}
