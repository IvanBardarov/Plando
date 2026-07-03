using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItems;

public class DeleteTaskItemCommandHandler
{
    private readonly ITaskItemRepository _taskItemRepository;

    public DeleteTaskItemCommandHandler(ITaskItemRepository taskItemRepository)
    {
        _taskItemRepository = taskItemRepository;
    }

    public async Task HandleAsync(DeleteTaskItemCommand command)
    {
        var taskItem = await _taskItemRepository.GetByIdAsync(command.TaskItemId);

        if (taskItem is null)
            throw new DomainException($"There is not such task item with id = {command.TaskItemId}!");

        await _taskItemRepository.DeleteAsync(taskItem);
        await _taskItemRepository.SaveChangesAsync();
    }
}