using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskCategories;

public class CreateTaskCategoryCommandHandler
{
    private readonly ITaskCategoryRepository _taskCategoryRepository;
    private readonly IUserRepository _userRepository;

    public CreateTaskCategoryCommandHandler(
        ITaskCategoryRepository taskCategoryRepository,
        IUserRepository userRepository
        )
    {
        _taskCategoryRepository = taskCategoryRepository;
        _userRepository = userRepository;
    }

    public async Task<TaskCategoryDto>
        HandleAsync(CreateTaskCategoryCommand command)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);
        if (user is null)
            throw new DomainException("There is not such an user!");

        var taskCategory = TaskCategory
            .Create(command.Name, command.Description, user);

        await _taskCategoryRepository.AddAsync(taskCategory);
        await _taskCategoryRepository.SaveChangesAsync();

        return TaskCategoryDto.FromEntity(taskCategory);
    }
}