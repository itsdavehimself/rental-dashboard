using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ManifestArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsTrips_Events_EventId",
                table: "LogisticsTrips");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsTrips_EventId",
                table: "LogisticsTrips");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "LogisticsTrips");

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "LogisticsWorkItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientSignatureUrl",
                table: "LogisticsTrips",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LogisticsPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    LogisticsWorkItemId = table.Column<int>(type: "integer", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsPhotos_LogisticsWorkItems_LogisticsWorkItemId",
                        column: x => x.LogisticsWorkItemId,
                        principalTable: "LogisticsWorkItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsWorkItems_EventId",
                table: "LogisticsWorkItems",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsPhotos_LogisticsWorkItemId",
                table: "LogisticsPhotos",
                column: "LogisticsWorkItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsWorkItems_Events_EventId",
                table: "LogisticsWorkItems",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsWorkItems_Events_EventId",
                table: "LogisticsWorkItems");

            migrationBuilder.DropTable(
                name: "LogisticsPhotos");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsWorkItems_EventId",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "LogisticsWorkItems");

            migrationBuilder.DropColumn(
                name: "ClientSignatureUrl",
                table: "LogisticsTrips");

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "LogisticsTrips",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTrips_EventId",
                table: "LogisticsTrips",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsTrips_Events_EventId",
                table: "LogisticsTrips",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
