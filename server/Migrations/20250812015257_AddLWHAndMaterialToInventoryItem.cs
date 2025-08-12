using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddLWHAndMaterialToInventoryItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dimensions",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "InventoryItems",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Length",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Material",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Uid",
                table: "InventoryItems",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "InventoryItems",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Material",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Uid",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "InventoryItems",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Dimensions",
                table: "InventoryItems",
                type: "text",
                nullable: true);
        }
    }
}
