using Plando.Domain.Exceptions;

namespace Plando.Domain.Entities;

public class Note
{

    private Note(){ }

    public static Note Create(string content, Guid taskItemId, Guid userId)
    {
        Validate(content, taskItemId, userId);

        return new Note
        {
            Id = Guid.NewGuid(),
            Content = content,
            CreatedAt = DateTime.UtcNow,
            TaskItemId = taskItemId,
            UserId = userId
        };
    }

    private static void Validate(string content, Guid taskItemId, Guid userId)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new DomainException("Note content can not be empty!");

        if(taskItemId.Equals(Guid.Empty))
            throw new DomainException("Note taskItemId is required!");

        if (userId.Equals(Guid.Empty))
            throw new DomainException("Note userId is required!");
    }

    public Guid Id { get; private set; }
    public string Content { get; private set; } = null!;
    public DateTime CreatedAt { get; init; }
    public Guid TaskItemId { get; init; }
    public TaskItem? TaskItem { get; private set; }
    public Guid UserId { get; init; }
    public User? User { get; private set; }
}
