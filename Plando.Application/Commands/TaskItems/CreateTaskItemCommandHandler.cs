using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItems;

public class CreateTaskItemCommandHandler
{
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly IUserRepository _userRepository;

    public CreateTaskItemCommandHandler(ITaskItemRepository taskItemRepository,
        IUserRepository userRepository)
    {
        _taskItemRepository = taskItemRepository;
        _userRepository = userRepository;
    }

    public async Task<TaskItemDto> HandleAsync(CreateTaskItemCommand command)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);

        if (user is null)
            throw new DomainException("There is not such an user!");

        var taskItem = TaskItem.Create(command.Title, command.Description,
            command.DueDate, user);

        await _taskItemRepository.AddAsync(taskItem);
        await _taskItemRepository.SaveChangesAsync();

        return TaskItemDto.FromEntity(taskItem);
    }
}