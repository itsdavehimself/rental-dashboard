using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SplitAddressNameInEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeliveryName",
                table: "Events",
                newName: "DeliveryLastName");

            migrationBuilder.RenameColumn(
                name: "BillingName",
                table: "Events",
                newName: "DeliveryFirstName");

            migrationBuilder.AddColumn<string>(
                name: "BillingFirstName",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BillingLastName",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillingFirstName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingLastName",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "DeliveryLastName",
                table: "Events",
                newName: "DeliveryName");

            migrationBuilder.RenameColumn(
                name: "DeliveryFirstName",
                table: "Events",
                newName: "BillingName");
        }
    }
}
