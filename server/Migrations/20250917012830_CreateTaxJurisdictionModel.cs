using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class CreateTaxJurisdictionModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaxJurisdictions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Address = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    ZipCode = table.Column<string>(type: "text", nullable: false),
                    ZipCodePlus4 = table.Column<string>(type: "text", nullable: true),
                    LocCode = table.Column<string>(type: "text", nullable: false),
                    District = table.Column<string>(type: "text", nullable: false),
                    HighRate = table.Column<decimal>(type: "numeric", nullable: false),
                    LowRate = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxJurisdictions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaxJurisdictions_LocCode",
                table: "TaxJurisdictions",
                column: "LocCode");

            migrationBuilder.CreateIndex(
                name: "IX_TaxJurisdictions_ZipCode_City_Address",
                table: "TaxJurisdictions",
                columns: new[] { "ZipCode", "City", "Address" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaxJurisdictions");
        }
    }
}
