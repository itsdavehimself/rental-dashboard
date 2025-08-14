using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInventoryConfigWithLabels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "InventoryTypes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "InventorySubTypes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "InventoryMaterials",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "InventoryColors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "BounceHouseTypes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Label",
                value: "Dolphin");

            migrationBuilder.UpdateData(
                table: "BounceHouseTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "Label",
                value: "Spongebob");

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 1,
                column: "Label",
                value: "Black");

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 2,
                column: "Label",
                value: "Black");

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "White");

            migrationBuilder.UpdateData(
                table: "InventoryColors",
                keyColumn: "Id",
                keyValue: 4,
                column: "Label",
                value: "White");

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 1,
                column: "Label",
                value: "Plastic");

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 2,
                column: "Label",
                value: "Plastic");

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "Resin");

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 4,
                column: "Label",
                value: "Metal");

            migrationBuilder.UpdateData(
                table: "InventoryMaterials",
                keyColumn: "Id",
                keyValue: 5,
                column: "Label",
                value: "Vinyl");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Label",
                value: "Folding");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "Label",
                value: "Folding");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "Canopy");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "Label",
                value: "Pole Tent");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "Label",
                value: "Mechanical Bull");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 6,
                column: "Label",
                value: "Bounce House");

            migrationBuilder.UpdateData(
                table: "InventorySubTypes",
                keyColumn: "Id",
                keyValue: 7,
                column: "Label",
                value: "String Lights");

            migrationBuilder.UpdateData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "Label",
                value: "Table");

            migrationBuilder.UpdateData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 2,
                column: "Label",
                value: "Chair");

            migrationBuilder.UpdateData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Label",
                value: "Tent");

            migrationBuilder.UpdateData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "Label",
                value: "Lighting");

            migrationBuilder.UpdateData(
                table: "InventoryTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "Label",
                value: "Attraction");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Label",
                table: "InventoryTypes");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "InventorySubTypes");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "InventoryMaterials");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "InventoryColors");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "BounceHouseTypes");
        }
    }
}
