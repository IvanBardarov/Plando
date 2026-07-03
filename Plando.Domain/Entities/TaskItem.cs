using Plando.Domain.Exceptions;

namespace Plando.Domain.Entities;

public sealed class TaskItem
{
    private TaskItem() { }

    /// <summary>
    /// Factory method - a static method that encapsulates the creation and validation of an object,
    /// returning a fully initialized instance.
    /// Creates a new TaskItem with the given title, description, dueDate, user and optional taskList.
    /// Throws <see cref="DomainException"/> if any argument is invalid.
    /// </summary>
    /// <param name="title"></param>
    /// <param name="description"></param>
    /// <param name="dueDate"></param>
    /// <param name="user"></param>
    /// <param name="taskList"></param>
    /// <returns></returns>
    /// <exception cref="DomainException"></exception>
    public static TaskItem Create(string title, string description, DateTime dueDate, User user, TaskList? taskList = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("TaskItem.Create: title can not be empty!");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("TaskItem.Create: description can not be empty!");

        if (dueDate == DateTime.MinValue)
            throw new DomainException($"TaskItem.Create: dueDate can not be {dueDate}!");

        if (user is null)
            throw new DomainException("TaskItem: User can not be null!");

        // todo: to check if userId exists

        return new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            DueDate = dueDate,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UserId = user.Id,
            User = user,
            TaskListId = taskList?.Id ?? Guid.Empty,
            TaskList = taskList
        };
    }

    public void Complete()
    {
        IsCompleted = true;
    }

    public Guid Id { get; init; }
    public required string Title { get; init; }
    public required string Description { get; init; }
    public DateTime DueDate { get; init; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public required User User { get; init; }
    public Guid TaskListId { get; init; }    
    public TaskList? TaskList { get; init; }
}