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

        if (taskItems is null || !taskItems.Any())
            return new List<TaskItemDto>();

        var taskItemDTOs = taskItems.Select(TaskItemDto.FromEntity);

        return taskItemDTOs;
    }
}