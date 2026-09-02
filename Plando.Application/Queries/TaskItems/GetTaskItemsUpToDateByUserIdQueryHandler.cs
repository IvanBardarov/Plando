using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskItems;

public class GetTaskItemsUpToDateByUserIdQueryHandler
{
    private readonly ITaskItemRepository _taskItemRepository;

    public GetTaskItemsUpToDateByUserIdQueryHandler(
        ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }

    public async Task<IEnumerable<TaskItemDto>> HandleAsync(GetTaskItemsUpToDateByUserIdQuery query)
    {
        var taskItems = await _taskItemRepository
            .GetAllByUserUpToDateAsync(query.UserId, query.Date, query.IsCompleted);

        var taskItemDTOs = taskItems.Select(TaskItemDto.FromEntity);

        return taskItemDTOs;
    }
}