using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddLogisticsAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LogisticsTasks_Users_CrewLeadId",
                table: "LogisticsTasks");

            migrationBuilder.DropIndex(
                name: "IX_LogisticsTasks_CrewLeadId",
                table: "LogisticsTasks");

            migrationBuilder.DropColumn(
                name: "CrewLeadId",
                table: "LogisticsTasks");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "LogisticsTasks",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateTable(
                name: "LogisticsTaskAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    LogisticsTaskId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    IsLead = table.Column<bool>(type: "boolean", nullable: false),
                    RoleNotes = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogisticsTaskAssignments");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "LogisticsTasks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "CrewLeadId",
                table: "LogisticsTasks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsTasks_CrewLeadId",
                table: "LogisticsTasks",
                column: "CrewLeadId");

            migrationBuilder.AddForeignKey(
                name: "FK_LogisticsTasks_Users_CrewLeadId",
                table: "LogisticsTasks",
                column: "CrewLeadId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
