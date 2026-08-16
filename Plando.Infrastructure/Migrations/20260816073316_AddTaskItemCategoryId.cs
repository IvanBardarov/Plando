using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plando.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskItemCategoryId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "TaskItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskItems_CategoryId",
                table: "TaskItems",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItems_TaskCategories_CategoryId",
                table: "TaskItems",
                column: "CategoryId",
                principalTable: "TaskCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItems_TaskCategories_CategoryId",
                table: "TaskItems");

            migrationBuilder.DropIndex(
                name: "IX_TaskItems_CategoryId",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "TaskItems");
        }
    }
}
