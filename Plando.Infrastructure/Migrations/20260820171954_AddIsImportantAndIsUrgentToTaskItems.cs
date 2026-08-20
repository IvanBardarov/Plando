using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plando.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsImportantAndIsUrgentToTaskItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsImportant",
                table: "TaskItems",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsUrgent",
                table: "TaskItems",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsImportant",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "IsUrgent",
                table: "TaskItems");
        }
    }
}
