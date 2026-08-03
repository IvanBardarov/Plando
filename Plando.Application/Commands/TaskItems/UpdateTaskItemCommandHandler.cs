using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItems;

public class UpdateTaskItemCommandHandler
{
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly ITaskListRepository _taskListRepository;

    public UpdateTaskItemCommandHandler(
        ITaskItemRepository taskItemRepository,
        ITaskListRepository taskListRepository)
    {
        _taskItemRepository = taskItemRepository;
        _taskListRepository = taskListRepository;
    }

    public async Task<TaskItemDto> HandleAsync(UpdateTaskItemCommand command)
    {
        var taskItem = await _taskItemRepository.GetByIdAsync(command.Id);

        Domain.Entities.TaskList? taskList = null;
        if (command.TaskListId is not null)
            taskList = await _taskListRepository.GetByIdAsync((Guid)command.TaskListId!);

        if (taskItem is null)
            throw new DomainException($"There is no a task with an id: {command.Id}");

        taskItem.Update(
            command.Title,
            command.Description,
            command.StartDate,
            command.DueDate,
            command.TaskListId,
            taskList);

        await _taskItemRepository.SaveChangesAsync();

        return TaskItemDto.FromEntity(taskItem);
    }
}
