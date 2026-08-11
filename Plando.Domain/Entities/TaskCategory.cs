using Plando.Domain.Exceptions;

namespace Plando.Domain.Entities;

public class TaskCategory
{
    private TaskCategory() { }

    /// <summary>
    /// Factory method - a static method that encapsulates the creation and
    /// validation of an object, returning a fully initialized instance.
    /// Creates a new TaskCategory with the given name, description and user.
    /// Throws <see cref="DomainException"/> if any argument is invalid.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="description"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public static TaskCategory Create(string name, string description, User user)
    {
        Validate(name, description, user);

        return new TaskCategory
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            User = user,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string description)
    {
        Validate(name, description);
        Name = name;
        Description = description;
    }

    private static void Validate(string name, string description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Task category name can not be " +
                "null or empty!");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Task category description can not be " +
                "null or empty!");
    }

    private static void Validate(string name, string description, User user)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Task category name can not be " +
                "null or empty!");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Task category description can not be " +
                "null or empty!");

        if (user is null)
            throw new DomainException("Task category can not be " +
                "assigned to null user!");
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
}