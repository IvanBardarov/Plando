using Plando.Domain.Entities;

namespace Plando.Application.DTOs;

public class TaskCategoryDto
{
    private TaskCategoryDto(TaskCategory taskCategory)
    {
        if (taskCategory is null)
            throw new ArgumentNullException(nameof(taskCategory));

        Id = taskCategory.Id;
        Name = taskCategory.Name;
        Description = taskCategory.Description;
        UserId = taskCategory.UserId;
        CreatedAt = taskCategory.CreatedAt;
    }

    public static TaskCategoryDto FromEntity(TaskCategory taskCategory)
    {
        return new TaskCategoryDto(taskCategory);
    }

    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Description { get; init; }
    public Guid UserId { get; init; }
    public DateTime CreatedAt { get; init; }
}