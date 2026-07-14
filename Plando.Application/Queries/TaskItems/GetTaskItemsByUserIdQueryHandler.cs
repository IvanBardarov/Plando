using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskItems;

public class GetTaskItemsByUserIdQueryHandler
{
    private readonly ITaskItemRepository _taskRepository;

    public GetTaskItemsByUserIdQueryHandler(ITaskItemRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IEnumerable<TaskItemDto>> HandleAsync(GetTaskItemsByUserIdQuery query)
    {
        var taskItems = await _taskRepository.GetAllByUserIdAsync(query.UserId);

        if (!string.IsNullOrWhiteSpace(query.Title))
            taskItems = taskItems.Where(t => t.Title.Contains(query.Title));

        if (!string.IsNullOrWhiteSpace(query.Description))
            taskItems = taskItems.Where(t => t.Description.Contains(query.Description));

        if (query.CreatedAtFrom is not null)
            taskItems = taskItems
                .Where(t => t.CreatedAt >= query.CreatedAtFrom);

        if (query.CreatedAtTo is not null)
            taskItems = taskItems
                .Where(t => t.CreatedAt <= query.CreatedAtTo);

        if (query.DueDateFrom is not null)
            taskItems = taskItems
                .Where(t => t.DueDate >= query.DueDateFrom);

        if (query.DueDateTo is not null)
            taskItems = taskItems
                .Where(t => t.DueDate <= query.DueDateTo);

        if (query.CompletedAtFrom is not null)
            taskItems = taskItems
                .Where(t => t.CompletedAt >= query.CompletedAtFrom);

        if (query.CompletedAtTo is not null)
            taskItems = taskItems
                .Where(t => t.CompletedAt <= query.CompletedAtTo);

        if (query.IsCompleted is true)
            taskItems = taskItems
                .Where(t => t.IsCompleted == true);
        else if(query.IsCompleted is false)
            taskItems = taskItems
                .Where(t => t.IsCompleted == false);

        if (taskItems is null || !taskItems.Any())
            return new List<TaskItemDto>();

        var taskItemDTOs = taskItems.Select(TaskItemDto.FromEntity);

        return taskItemDTOs;
    }
}