using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    /// <summary>
    /// Configures the entity mapping for <see cref="User"/> to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<User> users)
    {
        // table
        users.ToTable("Users");

        // primary key
        users.HasKey(user => user.Id);

        // properties
        users.Property(user => user.Email).IsRequired().HasMaxLength(255);
        users.Property(user => user.PasswordHash).IsRequired().HasMaxLength(512);
        users.Property(user => user.CreatedAt);

        // indexes
        users.HasIndex(user => user.Email).IsUnique();

        // relations many-to-one
        users.HasMany(user => user.TaskItems)
            .WithOne(taskItem => taskItem.User)
            .HasForeignKey(taskItem => taskItem.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        users.HasMany(user => user.TaskLists)
            .WithOne(taskList => taskList.User)
            .HasForeignKey(taskList => taskList.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}