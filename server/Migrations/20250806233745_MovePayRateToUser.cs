using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class MovePayRateToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomPayRate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PayRate",
                table: "JobTitles");

            migrationBuilder.AddColumn<decimal>(
                name: "PayRate",
                table: "Users",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PayRate",
                table: "Users");

            migrationBuilder.AddColumn<decimal>(
                name: "CustomPayRate",
                table: "Users",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PayRate",
                table: "JobTitles",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
