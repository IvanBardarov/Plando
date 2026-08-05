using Plando.Domain.Entities;

namespace Plando.Application.DTOs;

public class NoteDto
{
    private NoteDto(Note note)
    {
        if (note is null)
            throw new ArgumentNullException(nameof(note));

        this.Id = note.Id;
        this.Content = note.Content;
        this.CreatedAt = note.CreatedAt;
        this.TaskItemId = note.TaskItemId;
        this.UserId = note.UserId;
    }

    public static NoteDto FromEntity(Note note)
    {
        return new NoteDto(note);
    }

    public Guid Id { get; init; }
    public string Content { get; init; }
    public DateTime CreatedAt { get; init; }
    public Guid TaskItemId { get; init; }
    public Guid UserId { get; init; }
}