using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddTrucksToTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TruckId",
                table: "LogisticsTrips",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Trucks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CapacityCubicFeet = table.Column<int>(type: "integer", nullable: true),
                    WeightLimit = table.Column<int>(type: "integer", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trucks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTrips_TruckId_ScheduledStart_ScheduledEnd",
                table: "LogisticsTrips",
                columns: new[] { "TruckId", "ScheduledStart", "ScheduledEnd" });

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsTrips_Trucks_TruckId",
                table: "LogisticsTrips",
                column: "TruckId",
                principalTable: "Trucks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsTrips_Trucks_TruckId",
                table: "LogisticsTrips");

            migrationBuilder.DropTable(
                name: "Trucks");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsTrips_TruckId_ScheduledStart_ScheduledEnd",
                table: "LogisticsTrips");

            migrationBuilder.DropColumn(
                name: "TruckId",
                table: "LogisticsTrips");
        }
    }
}
