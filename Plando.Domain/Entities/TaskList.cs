using Plando.Domain.Enums;
using Plando.Domain.Exceptions;

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
        Validate("Create", name, user);

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

    public void Update(string name, TaskListColor color)
    {
        Validate("Update", name);

        Name = name;
        Color = color;
    }

    private static void Validate(string methodName, string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException($"TaskList.{methodName}: name can not be empty!");
    }

    private static void Validate(string methodName, string name, User user)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException($"TaskList.{methodName}: name can not be empty!");

        if (user is null)
            throw new DomainException($"TaskList.{methodName}: user can not be null!");
    }

    public Guid Id { get; init; }
    public string Name { get; private set; } = null!;
    public TaskListColor Color { get; private set; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public User User { get; private set; } = null!;
    public ICollection<TaskItem> TaskItems { get; init; } = [];

}
