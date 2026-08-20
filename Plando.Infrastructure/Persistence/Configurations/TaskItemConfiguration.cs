using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    /// <summary>
    /// Configures the entity mapping for <see cref="TaskItem"/>
    /// to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<TaskItem> taskItems)
    {
        // table
        taskItems.ToTable("TaskItems");

        // primary key
        taskItems.HasKey(taskItem => taskItem.Id);

        // properties
        taskItems.Property(taskItem => taskItem.Title).IsRequired().HasMaxLength(255);
        taskItems.Property(taskItem => taskItem.Description).IsRequired().HasMaxLength(1000);
        taskItems.Property(taskItem => taskItem.DueDate);
        taskItems.Property(taskItem => taskItem.IsCompleted);
        taskItems.Property(taskItem => taskItem.CreatedAt);
        taskItems.Property(taskItem => taskItem.CategoryId);
        taskItems.Property(taskItem => taskItem.IsImportant);
        taskItems.Property(taskItem => taskItem.IsUrgent);

        // relations one-to-many
        taskItems.HasOne(taskItem => taskItem.TaskList)
            .WithMany(taskList => taskList.TaskItems)
            .HasForeignKey(taskItem => taskItem.TaskListId)
            .OnDelete(DeleteBehavior.SetNull);

        taskItems.HasOne<TaskCategory>()
            .WithMany()
            .HasForeignKey(taskItem => taskItem.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}