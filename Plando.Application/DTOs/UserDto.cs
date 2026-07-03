using Plando.Domain.Entities;

namespace Plando.Application.DTOs;

public class UserDto
{
    private UserDto(User user)
    {
        if (user is null)
            throw new ArgumentNullException(nameof(user));

        this.Id = user.Id;
        this.Email = user.Email;
        this.CreatedAt = user.CreatedAt;
        this.TaskItems = user.TaskItems?
            .Select(TaskItemDto.FromEntity)
            .ToList() ?? new List<TaskItemDto>();
        this.TaskLists = user.TaskLists?
            .Select(TaskListDto.FromEntity)
            .ToList() ?? new List<TaskListDto>();
    }

    public static UserDto FromEntity(User user)
    {
        return new UserDto(user);
    }

    public Guid Id { get; init; }
    public string? Email { get; init; }
    public DateTime CreatedAt { get; init; }
    public ICollection<TaskItemDto> TaskItems { get; init; } = [];
    public ICollection<TaskListDto> TaskLists { get; init; } = [];
}