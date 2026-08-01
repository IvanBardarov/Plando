using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.TaskItems;

public class GetTaskItemByIdQueryHandler
{
    private readonly ITaskItemRepository _taskItemRepository;

    public GetTaskItemByIdQueryHandler(ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }

    public async Task<TaskItemDto> HandleAsync(GetTaskItemByIdQuery query)
    {
        var taskItem = await _taskItemRepository.GetByIdAsync(query.TaskItemId);
        if (taskItem is null)
            throw new DomainException($"There is no such a task with an id: {query.TaskItemId}!");

        return TaskItemDto.FromEntity(taskItem);
    }
}