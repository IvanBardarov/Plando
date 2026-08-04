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
    public static TaskItem Create(
        string title, string description, DateTime dueDate, User user, 
        DateTime? startDate, TaskList? taskList = null)
    {
        if (user is null)
            throw new DomainException("TaskItem.Create: User can not be null!");

        var createdAt = DateTime.UtcNow;
        Validate("Create", title, description, dueDate, startDate, createdAt);

        // todo: to check if userId exists

        return new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            DueDate = dueDate,
            IsCompleted = false,
            CreatedAt = createdAt,
            UserId = user.Id,
            User = user,
            TaskListId = taskList?.Id,
            TaskList = taskList,
            StartDate = startDate
        };
    }

    public void Complete()
    {
        IsCompleted = true;
        CompletedAt = DateTime.UtcNow;
    }

    public void Update(string title, string description, DateTime? startDate,
        DateTime dueDate, Guid? taskListId, TaskList? taskList)
    {
        Validate("Update", title, description, dueDate, startDate, CreatedAt);

        Title = title;
        Description = description;
        StartDate = startDate;
        DueDate = dueDate;
        TaskListId = taskListId;
        TaskList = taskList;
    }

    private static void Validate(string methodName, string title, string description, 
        DateTime dueDate, DateTime? startDate, DateTime minStartDate)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException($"TaskItem.{methodName}: title can not be empty!");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException($"TaskItem.{methodName}: description can not be empty!");

        if (dueDate == DateTime.MinValue)
            throw new DomainException($"TaskItem.{methodName}: dueDate can not be {dueDate}!");

        if (startDate is not null && startDate.Value.Date < minStartDate.Date)
            throw new DomainException($"TaskItem.{methodName}: Start date of the task can not be older" +
                " than the date of task creation!");

        if (startDate is not null && startDate > dueDate)
            throw new DomainException($"TaskItem.{methodName}: Start date of the task can not be newer" +
                " than the due date of the task!");
    }

    public Guid Id { get; init; }
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public DateTime DueDate { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public User User { get; private set; } = null!;
    public Guid? TaskListId { get; private set; }    
    public TaskList? TaskList { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public DateTime? StartDate { get; private set; }
}