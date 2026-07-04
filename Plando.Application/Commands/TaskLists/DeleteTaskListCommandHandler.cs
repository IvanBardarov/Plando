using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskLists;

public class DeleteTaskListCommandHandler
{
    private readonly ITaskListRepository _taskListRepository;

    public DeleteTaskListCommandHandler(ITaskListRepository taskListRepository)
    {
        _taskListRepository = taskListRepository;
    }

    public async Task HandleAsync(DeleteTaskListCommand command)
    {
        var taskList = await _taskListRepository.GetByIdAsync(command.TaskListId);

        if (taskList is null)
            throw new DomainException($"There is not such task list with id = {command.TaskListId}!");

        await _taskListRepository.DeleteAsync(taskList);
        await _taskListRepository.SaveChangesAsync();
    }
}
