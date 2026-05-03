using Plando.Domain.Exceptions;
using Plando.Domain.Enums;

namespace Plando.Domain.Entities;

public sealed class TaskList
{
    private TaskList() { }

    /// <summary>
    /// Factory method - a static method that encapsulates the creation and validation of an object,
    /// returning a fully initialized instance.
    /// Creates a new TaskList with the given name, color and user.
    /// Throws <see cref="DomainException"/> if any argument is invalid.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="color"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    /// <exception cref="DomainException"></exception>
    public static TaskList Create(string name, TaskListColor color, User user)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("TaskList.Create: name can not be empty!");

        if (user is null)
            throw new DomainException("TaskList.Create: user can not be null!");

        return new TaskList
        {
            Id = Guid.NewGuid(),
            Name = name,
            Color = color,
            CreatedAt = DateTime.UtcNow,
            UserId = user.Id,
            User = user
        };
    }

    public Guid Id { get; init; }
    public required string Name { get; init; }
    public TaskListColor Color { get; init; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public required User User { get; init; }
    public ICollection<TaskItem> TaskItems { get; init; } = [];

}
