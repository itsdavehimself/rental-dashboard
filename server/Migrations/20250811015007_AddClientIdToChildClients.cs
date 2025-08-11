using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddClientIdToChildClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResidentialClients_Clients_Uid",
                table: "ResidentialClients");

            migrationBuilder.RenameColumn(
                name: "Uid",
                table: "ResidentialClients",
                newName: "ClientId");

            migrationBuilder.RenameIndex(
                name: "IX_ResidentialClients_Uid",
                table: "ResidentialClients",
                newName: "IX_ResidentialClients_ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_ResidentialClients_Clients_ClientId",
                table: "ResidentialClients",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResidentialClients_Clients_ClientId",
                table: "ResidentialClients");

            migrationBuilder.RenameColumn(
                name: "ClientId",
                table: "ResidentialClients",
                newName: "Uid");

            migrationBuilder.RenameIndex(
                name: "IX_ResidentialClients_ClientId",
                table: "ResidentialClients",
                newName: "IX_ResidentialClients_Uid");

            migrationBuilder.AddForeignKey(
                name: "FK_ResidentialClients_Clients_Uid",
                table: "ResidentialClients",
                column: "Uid",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
