using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence.Configurations;

public class NoteConfiguration : IEntityTypeConfiguration<Note>
{
    /// <summary>
    /// Configures the entity mapping for <see cref="Note"/> to the database table,
    /// including properties, indexes and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<Note> notes)
    {
        // table
        notes.ToTable("Notes");

        // primary key
        notes.HasKey(note => note.Id);

        // properties
        notes.Property(note => note.Content).IsRequired().HasMaxLength(1024);
        notes.Property(note => note.CreatedAt).IsRequired();
        notes.Property(note => note.TaskItemId).IsRequired();
        notes.Property(note => note.UserId).IsRequired();

        // relations one-to-many
        notes.HasOne(note => note.TaskItem)
            .WithMany().HasForeignKey(note => note.TaskItemId);
        notes.HasOne(note => note.User)
            .WithMany().HasForeignKey(note => note.UserId);
    }
}