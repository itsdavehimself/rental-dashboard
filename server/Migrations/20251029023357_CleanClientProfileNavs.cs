using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class CleanClientProfileNavs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientProfiles_Addresses_AddressId1",
                table: "ClientProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientProfiles_Contacts_ContactId1",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_AddressId",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_AddressId1",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_ContactId",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_ContactId1",
                table: "ClientProfiles");

            migrationBuilder.DropColumn(
                name: "AddressId1",
                table: "ClientProfiles");

            migrationBuilder.DropColumn(
                name: "ContactId1",
                table: "ClientProfiles");

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_AddressId",
                table: "ClientProfiles",
                column: "AddressId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_ContactId",
                table: "ClientProfiles",
                column: "ContactId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_AddressId",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_ContactId",
                table: "ClientProfiles");

            migrationBuilder.AddColumn<int>(
                name: "AddressId1",
                table: "ClientProfiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactId1",
                table: "ClientProfiles",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_AddressId",
                table: "ClientProfiles",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_AddressId1",
                table: "ClientProfiles",
                column: "AddressId1",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_ContactId",
                table: "ClientProfiles",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientProfiles_ContactId1",
                table: "ClientProfiles",
                column: "ContactId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ClientProfiles_Addresses_AddressId1",
                table: "ClientProfiles",
                column: "AddressId1",
                principalTable: "Addresses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientProfiles_Contacts_ContactId1",
                table: "ClientProfiles",
                column: "ContactId1",
                principalTable: "Contacts",
                principalColumn: "Id");
        }
    }
}
