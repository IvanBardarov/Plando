using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class TaskListConfiguration : IEntityTypeConfiguration<TaskList>
{
    /// <summary>
    /// Configures the entity mapping for <see cref="TaskList"/> to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<TaskList> taskLists)
    {
        // table
        taskLists.ToTable("TaskLists");

        // primary key
        taskLists.HasKey(taskList => taskList.Id);

        // properties
        taskLists.Property(taskList => taskList.Name).IsRequired().HasMaxLength(255);
        taskLists.Property(taskList => taskList.Color).HasConversion<short>();
        taskLists.Property(taskList => taskList.CreatedAt);
    }
}