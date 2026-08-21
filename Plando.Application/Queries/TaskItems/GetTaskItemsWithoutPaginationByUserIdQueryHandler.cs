using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskItems;

public class GetTaskItemsWithoutPaginationByUserIdQueryHandler
{
    private readonly ITaskItemRepository _taskItemRepository;

    public GetTaskItemsWithoutPaginationByUserIdQueryHandler(
        ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }

    public async Task<IEnumerable<TaskItemDto>> 
        HandleAsync(GetTaskItemsWithoutPaginationByUserIdQuery query)
    {
        var taskItems = await _taskItemRepository.GetAllByUserIdAsync(query.UserId);

        return taskItems.Select(TaskItemDto.FromEntity);
    }
}