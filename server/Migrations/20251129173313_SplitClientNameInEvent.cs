using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SplitClientNameInEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ClientName",
                table: "Events",
                newName: "ClientLastName");

            migrationBuilder.AddColumn<string>(
                name: "ClientFirstName",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientFirstName",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "ClientLastName",
                table: "Events",
                newName: "ClientName");
        }
    }
}
