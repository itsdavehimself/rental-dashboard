using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddLast4AndCardBrandToTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardBrand",
                table: "Transactions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Last4",
                table: "Transactions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardBrand",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "Last4",
                table: "Transactions");
        }
    }
}
