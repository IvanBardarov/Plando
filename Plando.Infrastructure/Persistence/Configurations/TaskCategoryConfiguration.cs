using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class TaskCategoryConfiguration : IEntityTypeConfiguration<TaskCategory>
{
    /// <summary>
    /// Configures the entity mapping for <see cref="TaskCategory"/>
    /// to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<TaskCategory> taskCategory)
    {
        // table
        taskCategory.ToTable("TaskCategories");

        // primary key
        taskCategory.HasKey(taskCategory => taskCategory.Id);

        // properties
        taskCategory.Property(taskCategory => taskCategory.Name)
            .IsRequired().HasMaxLength(255);
        taskCategory.Property(taskCategory => taskCategory.Description)
            .IsRequired().HasMaxLength(1024);
        taskCategory.Property(taskCategory => taskCategory.UserId)
            .IsRequired();

        // relations one-to-many
        taskCategory.HasOne(taskCategory => taskCategory.User)
            .WithMany()
            .HasForeignKey(taskCategory => taskCategory.UserId);
    }
}