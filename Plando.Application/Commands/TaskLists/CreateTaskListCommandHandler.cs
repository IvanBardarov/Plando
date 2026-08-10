using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskLists;

public class CreateTaskListCommandHandler
{
    private readonly ITaskListRepository _taskListRepository;
    private readonly IUserRepository _userRepository;

    public CreateTaskListCommandHandler(ITaskListRepository taskListRepository,
        IUserRepository userRepository)
    {
        _taskListRepository = taskListRepository;
        _userRepository = userRepository;
    }

    public async Task<TaskListDto> HandleAsync(CreateTaskListCommand command)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);

        if (user is null)
            throw new DomainException("There is not such an user!");

        var taskList = TaskList.Create(command.Name, user);

        await _taskListRepository.AddAsync(taskList);
        await _taskListRepository.SaveChangesAsync();

        return TaskListDto.FromEntity(taskList);
    }
}