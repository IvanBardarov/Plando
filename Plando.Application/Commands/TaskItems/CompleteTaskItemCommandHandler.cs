using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItems;

public class CompleteTaskItemCommandHandler
{
    private readonly ITaskItemRepository _taskItemRepository;

    public CompleteTaskItemCommandHandler(ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }

    public async Task<TaskItemDto> HandleAsync(CompleteTaskItemCommand command)
    {
        var taskItem = await _taskItemRepository.GetByIdAsync(command.TaskItemId);

        if (taskItem is null)
            throw new DomainException($"There is not such task item with id = {command.TaskItemId}!");

        taskItem.Complete();
        await _taskItemRepository.SaveChangesAsync();

        return TaskItemDto.FromEntity(taskItem);
    }
}