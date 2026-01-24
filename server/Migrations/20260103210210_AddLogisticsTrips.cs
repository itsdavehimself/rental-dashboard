using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddLogisticsTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogisticsTaskAssignments");

            migrationBuilder.DropTable(
                name: "LogisticsTasks");

            migrationBuilder.CreateTable(
                name: "LogisticsTrips",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ScheduledStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ScheduledEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualArrival = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InternalNotes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsTrips", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsTrips_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogisticsAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    LogisticsTripId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    IsLead = table.Column<bool>(type: "boolean", nullable: false),
                    RoleNotes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsAssignments_LogisticsTrips_LogisticsTripId",
                        column: x => x.LogisticsTripId,
                        principalTable: "LogisticsTrips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LogisticsAssignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LogisticsWorkItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    LogisticsTripId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SpecificNotes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsWorkItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsWorkItems_LogisticsTrips_LogisticsTripId",
                        column: x => x.LogisticsTripId,
                        principalTable: "LogisticsTrips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsAssignments_LogisticsTripId",
                table: "LogisticsAssignments",
                column: "LogisticsTripId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsAssignments_Uid",
                table: "LogisticsAssignments",
                column: "Uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsAssignments_UserId",
                table: "LogisticsAssignments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTrips_EventId",
                table: "LogisticsTrips",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTrips_Uid",
                table: "LogisticsTrips",
                column: "Uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsWorkItems_LogisticsTripId",
                table: "LogisticsWorkItems",
                column: "LogisticsTripId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsWorkItems_Uid",
                table: "LogisticsWorkItems",
                column: "Uid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogisticsAssignments");

            migrationBuilder.DropTable(
                name: "LogisticsWorkItems");

            migrationBuilder.DropTable(
                name: "LogisticsTrips");

            migrationBuilder.CreateTable(
                name: "LogisticsTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EventId = table.Column<int>(type: "integer", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsTasks_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogisticsTaskAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LogisticsTaskId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsLead = table.Column<bool>(type: "boolean", nullable: false),
                    RoleNotes = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsTaskAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsTaskAssignments_LogisticsTasks_LogisticsTaskId",
                        column: x => x.LogisticsTaskId,
                        principalTable: "LogisticsTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LogisticsTaskAssignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTaskAssignments_LogisticsTaskId",
                table: "LogisticsTaskAssignments",
                column: "LogisticsTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTaskAssignments_Uid",
                table: "LogisticsTaskAssignments",
                column: "Uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTaskAssignments_UserId",
                table: "LogisticsTaskAssignments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTasks_EventId",
                table: "LogisticsTasks",
                column: "EventId");
        }
    }
}
