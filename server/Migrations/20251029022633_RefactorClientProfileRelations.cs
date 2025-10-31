using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RefactorClientProfileRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Clients_ClientId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Clients_ClientId",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_ClientId",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_ClientId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Addresses");

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
                name: "IX_ClientProfiles_AddressId1",
                table: "ClientProfiles",
                column: "AddressId1",
                unique: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientProfiles_Addresses_AddressId1",
                table: "ClientProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientProfiles_Contacts_ContactId1",
                table: "ClientProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ClientProfiles_AddressId1",
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

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Contacts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Addresses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "Addresses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Addresses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_ClientId",
                table: "Contacts",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_ClientId",
                table: "Addresses",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Clients_ClientId",
                table: "Addresses",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Clients_ClientId",
                table: "Contacts",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
