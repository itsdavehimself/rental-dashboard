using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class Payments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Clients_ClientId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_ClientId",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "Events",
                newName: "DeliveryZipCode");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Events",
                newName: "DeliveryState");

            migrationBuilder.RenameColumn(
                name: "NormalizedStreet",
                table: "Events",
                newName: "DeliveryName");

            migrationBuilder.RenameColumn(
                name: "NormalizedCity",
                table: "Events",
                newName: "DeliveryCity");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Events",
                newName: "DeliveryAddressLine1");

            migrationBuilder.RenameColumn(
                name: "AddressLine2",
                table: "Events",
                newName: "InternalNotes");

            migrationBuilder.RenameColumn(
                name: "AddressLine1",
                table: "Events",
                newName: "ClientPhone");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Events",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "BillingAddressLine1",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BillingAddressLine2",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingCity",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BillingName",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BillingState",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BillingZipCode",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BusinessName",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientEmail",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddressLine2",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Discounts",
                table: "Events",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Subtotal",
                table: "Events",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxAmount",
                table: "Events",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                table: "Events",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Uid = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Method = table.Column<string>(type: "text", nullable: false),
                    ReceivedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TransactionId = table.Column<string>(type: "text", nullable: true),
                    Refunded = table.Column<bool>(type: "boolean", nullable: false),
                    RefundedAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    RefundedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RefundReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_EventId",
                table: "Payments",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Uid",
                table: "Payments",
                column: "Uid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropColumn(
                name: "BillingAddressLine1",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingAddressLine2",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingCity",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingState",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BillingZipCode",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "BusinessName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ClientEmail",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DeliveryAddressLine2",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Discounts",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Subtotal",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "TaxAmount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Total",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "InternalNotes",
                table: "Events",
                newName: "AddressLine2");

            migrationBuilder.RenameColumn(
                name: "DeliveryZipCode",
                table: "Events",
                newName: "ZipCode");

            migrationBuilder.RenameColumn(
                name: "DeliveryState",
                table: "Events",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "DeliveryName",
                table: "Events",
                newName: "NormalizedStreet");

            migrationBuilder.RenameColumn(
                name: "DeliveryCity",
                table: "Events",
                newName: "NormalizedCity");

            migrationBuilder.RenameColumn(
                name: "DeliveryAddressLine1",
                table: "Events",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "ClientPhone",
                table: "Events",
                newName: "AddressLine1");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Events",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_Events_ClientId",
                table: "Events",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Clients_ClientId",
                table: "Events",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
