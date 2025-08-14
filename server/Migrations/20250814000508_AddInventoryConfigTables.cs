using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryConfigTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "InventoryItems",
                newName: "InventoryTypeId");

            migrationBuilder.RenameColumn(
                name: "SubType",
                table: "InventoryItems",
                newName: "InventorySubTypeId");

            migrationBuilder.RenameColumn(
                name: "Material",
                table: "InventoryItems",
                newName: "InventoryMaterialId");

            migrationBuilder.AddColumn<int>(
                name: "BounceHouseTypeId",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InventoryColorId",
                table: "InventoryItems",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InventoryTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkuCode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InventorySubTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkuCode = table.Column<string>(type: "text", nullable: false),
                    InventoryTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventorySubTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventorySubTypes_InventoryTypes_InventoryTypeId",
                        column: x => x.InventoryTypeId,
                        principalTable: "InventoryTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BounceHouseTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    InventorySubTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BounceHouseTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BounceHouseTypes_InventorySubTypes_InventorySubTypeId",
                        column: x => x.InventorySubTypeId,
                        principalTable: "InventorySubTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryColors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkuCode = table.Column<string>(type: "text", nullable: false),
                    InventorySubTypeId = table.Column<int>(type: "integer", nullable: false),
                    InventoryTypeId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryColors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryColors_InventorySubTypes_InventorySubTypeId",
                        column: x => x.InventorySubTypeId,
                        principalTable: "InventorySubTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryColors_InventoryTypes_InventoryTypeId",
                        column: x => x.InventoryTypeId,
                        principalTable: "InventoryTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "InventoryMaterials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SkuCode = table.Column<string>(type: "text", nullable: false),
                    InventorySubTypeId = table.Column<int>(type: "integer", nullable: false),
                    InventoryTypeId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryMaterials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryMaterials_InventorySubTypes_InventorySubTypeId",
                        column: x => x.InventorySubTypeId,
                        principalTable: "InventorySubTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryMaterials_InventoryTypes_InventoryTypeId",
                        column: x => x.InventoryTypeId,
                        principalTable: "InventoryTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_BounceHouseTypeId",
                table: "InventoryItems",
                column: "BounceHouseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_InventoryColorId",
                table: "InventoryItems",
                column: "InventoryColorId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_InventoryMaterialId",
                table: "InventoryItems",
                column: "InventoryMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_InventorySubTypeId",
                table: "InventoryItems",
                column: "InventorySubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_InventoryTypeId",
                table: "InventoryItems",
                column: "InventoryTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_BounceHouseTypes_InventorySubTypeId",
                table: "BounceHouseTypes",
                column: "InventorySubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryColors_InventorySubTypeId",
                table: "InventoryColors",
                column: "InventorySubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryColors_InventoryTypeId",
                table: "InventoryColors",
                column: "InventoryTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryMaterials_InventorySubTypeId",
                table: "InventoryMaterials",
                column: "InventorySubTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryMaterials_InventoryTypeId",
                table: "InventoryMaterials",
                column: "InventoryTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_InventorySubTypes_InventoryTypeId",
                table: "InventorySubTypes",
                column: "InventoryTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_BounceHouseTypes_BounceHouseTypeId",
                table: "InventoryItems",
                column: "BounceHouseTypeId",
                principalTable: "BounceHouseTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryColors_InventoryColorId",
                table: "InventoryItems",
                column: "InventoryColorId",
                principalTable: "InventoryColors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryMaterials_InventoryMaterialId",
                table: "InventoryItems",
                column: "InventoryMaterialId",
                principalTable: "InventoryMaterials",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventorySubTypes_InventorySubTypeId",
                table: "InventoryItems",
                column: "InventorySubTypeId",
                principalTable: "InventorySubTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryTypes_InventoryTypeId",
                table: "InventoryItems",
                column: "InventoryTypeId",
                principalTable: "InventoryTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_BounceHouseTypes_BounceHouseTypeId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryColors_InventoryColorId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryMaterials_InventoryMaterialId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventorySubTypes_InventorySubTypeId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryTypes_InventoryTypeId",
                table: "InventoryItems");

            migrationBuilder.DropTable(
                name: "BounceHouseTypes");

            migrationBuilder.DropTable(
                name: "InventoryColors");

            migrationBuilder.DropTable(
                name: "InventoryMaterials");

            migrationBuilder.DropTable(
                name: "InventorySubTypes");

            migrationBuilder.DropTable(
                name: "InventoryTypes");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_BounceHouseTypeId",
                table: "InventoryItems");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_InventoryColorId",
                table: "InventoryItems");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_InventoryMaterialId",
                table: "InventoryItems");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_InventorySubTypeId",
                table: "InventoryItems");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_InventoryTypeId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "BounceHouseTypeId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "InventoryColorId",
                table: "InventoryItems");

            migrationBuilder.RenameColumn(
                name: "InventoryTypeId",
                table: "InventoryItems",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "InventorySubTypeId",
                table: "InventoryItems",
                newName: "SubType");

            migrationBuilder.RenameColumn(
                name: "InventoryMaterialId",
                table: "InventoryItems",
                newName: "Material");

            migrationBuilder.AddColumn<int>(
                name: "Color",
                table: "InventoryItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
