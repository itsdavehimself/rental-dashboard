using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCollectedByToProcessedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Users_CollectedById",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "CollectedById",
                table: "Transactions",
                newName: "ProcessedById");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_CollectedById",
                table: "Transactions",
                newName: "IX_Transactions_ProcessedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Users_ProcessedById",
                table: "Transactions",
                column: "ProcessedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Users_ProcessedById",
                table: "Transactions");

            migrationBuilder.RenameColumn(
                name: "ProcessedById",
                table: "Transactions",
                newName: "CollectedById");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_ProcessedById",
                table: "Transactions",
                newName: "IX_Transactions_CollectedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Users_CollectedById",
                table: "Transactions",
                column: "CollectedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
