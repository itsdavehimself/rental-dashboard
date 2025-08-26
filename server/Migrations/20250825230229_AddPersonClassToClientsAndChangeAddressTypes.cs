using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddPersonClassToClientsAndChangeAddressTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "ResidentialClients");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "ResidentialClients");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "ResidentialClients");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "ResidentialClients");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "ContactPerson");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "ContactPerson");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "ContactPerson");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "ContactPerson");

            migrationBuilder.AddColumn<int>(
                name: "PersonId",
                table: "ResidentialClients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PersonId",
                table: "ContactPerson",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "ClientAddresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "ClientAddresses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResidentialClients_PersonId",
                table: "ResidentialClients",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPerson_PersonId",
                table: "ContactPerson",
                column: "PersonId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactPerson_People_PersonId",
                table: "ContactPerson",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResidentialClients_People_PersonId",
                table: "ResidentialClients",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactPerson_People_PersonId",
                table: "ContactPerson");

            migrationBuilder.DropForeignKey(
                name: "FK_ResidentialClients_People_PersonId",
                table: "ResidentialClients");

            migrationBuilder.DropTable(
                name: "People");

            migrationBuilder.DropIndex(
                name: "IX_ResidentialClients_PersonId",
                table: "ResidentialClients");

            migrationBuilder.DropIndex(
                name: "IX_ContactPerson_PersonId",
                table: "ContactPerson");

            migrationBuilder.DropColumn(
                name: "PersonId",
                table: "ResidentialClients");

            migrationBuilder.DropColumn(
                name: "PersonId",
                table: "ContactPerson");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "ClientAddresses");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "ResidentialClients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "ResidentialClients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "ResidentialClients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "ResidentialClients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "ContactPerson",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "ContactPerson",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "ContactPerson",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "ContactPerson",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "ClientAddresses",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
