using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddCrewPresets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CrewPresets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    TruckId = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    LeadId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewPresets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CrewPresets_Trucks_TruckId",
                        column: x => x.TruckId,
                        principalTable: "Trucks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CrewPresets_Users_LeadId",
                        column: x => x.LeadId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CrewPresetMembers",
                columns: table => new
                {
                    CrewId = table.Column<int>(type: "integer", nullable: false),
                    CrewPresetId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewPresetMembers", x => new { x.CrewId, x.CrewPresetId });
                    table.ForeignKey(
                        name: "FK_CrewPresetMembers_CrewPresets_CrewPresetId",
                        column: x => x.CrewPresetId,
                        principalTable: "CrewPresets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrewPresetMembers_Users_CrewId",
                        column: x => x.CrewId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CrewPresetMembers_CrewPresetId",
                table: "CrewPresetMembers",
                column: "CrewPresetId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewPresets_LeadId",
                table: "CrewPresets",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewPresets_TruckId",
                table: "CrewPresets",
                column: "TruckId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewPresets_Uid",
                table: "CrewPresets",
                column: "Uid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CrewPresetMembers");

            migrationBuilder.DropTable(
                name: "CrewPresets");
        }
    }
}
