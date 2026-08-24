using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;

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
        IEnumerable<TaskItem> taskItems = new List<TaskItem>();

        taskItems = await _taskItemRepository
            .GetAllByUserIdAsync(query.UserId, query.DateFrom, query.DateTo);

        return taskItems.Select(TaskItemDto.FromEntity);
    }
}