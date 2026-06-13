using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddLogisticsManifestWorkItemFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LogisticsWorkItems_LogisticsTripId",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "LogisticsWorkItems");

            migrationBuilder.AddColumn<DateTime>(
                name: "ArrivedAt",
                table: "LogisticsWorkItems",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "LogisticsWorkItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "LogisticsWorkItems",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "LogisticsWorkItems",
                type: "text",
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsWorkItems_LogisticsTripId_SortOrder",
                table: "LogisticsWorkItems",
                columns: new[] { "LogisticsTripId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LogisticsWorkItems_LogisticsTripId_SortOrder",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "ArrivedAt",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "LogisticsWorkItems");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "LogisticsWorkItems",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsWorkItems_LogisticsTripId",
                table: "LogisticsWorkItems",
                column: "LogisticsTripId");
        }
    }
}
