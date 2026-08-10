using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plando.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTaskListColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "TaskLists");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "Color",
                table: "TaskLists",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }
    }
}
