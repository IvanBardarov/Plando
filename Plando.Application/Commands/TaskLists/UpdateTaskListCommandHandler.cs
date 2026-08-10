using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskLists;

public class UpdateTaskListCommandHandler
{
    private readonly ITaskListRepository _taskListRepository;

    public UpdateTaskListCommandHandler(
        ITaskListRepository taskListRepository)
    {
        _taskListRepository = taskListRepository;
    }

    public async Task<TaskListDto> HandleAsync(UpdateTaskListCommand command)
    {
        var taskList = await _taskListRepository.GetByIdAsync(command.Id);
        if (taskList is null)
            throw new DomainException($"There is no such a task list" +
                $" with id: {command.Id}");

        taskList.Update(command.Name);
        await _taskListRepository.SaveChangesAsync();

        return TaskListDto.FromEntity(taskList);
    }
}