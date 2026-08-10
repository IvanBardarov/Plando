using Plando.Domain.Entities;

namespace Plando.Application.DTOs;

public class TaskListDto
{
    private TaskListDto(TaskList taskList)
    {
        if (taskList is null)
            throw new ArgumentNullException(nameof(taskList));

        this.Id = taskList.Id;
        this.Name = taskList.Name;
        this.CreatedAt = taskList.CreatedAt;
        this.UserId = taskList.UserId;
        this.TaskItems = taskList.TaskItems?
            .Select(TaskItemDto.FromEntity)
            .ToList() ?? new List<TaskItemDto>();
    }

    public static TaskListDto FromEntity(TaskList taskList)
    {
        return new TaskListDto(taskList);
    }

    public Guid Id { get; init; }
    public string? Name { get; init; }
    public DateTime CreatedAt { get; init; }
    public Guid UserId { get; init; }
    public ICollection<TaskItemDto> TaskItems { get; init; } = [];
}