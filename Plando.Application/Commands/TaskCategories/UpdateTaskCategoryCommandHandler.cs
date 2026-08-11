using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskCategories;

public class UpdateTaskCategoryCommandHandler
{
    private readonly ITaskCategoryRepository _taskCategoryRepository;

    public UpdateTaskCategoryCommandHandler(
        ITaskCategoryRepository taskCategoryRepository)
    {
        _taskCategoryRepository = taskCategoryRepository;
    }

    public async Task<TaskCategoryDto> HandleAsync(UpdateTaskCategoryCommand command)
    {
        var taskCategory = await _taskCategoryRepository.GetByIdAsync(command.Id);
        if (taskCategory is null)
            throw new DomainException("There is no such a task category" +
                $" with id: {command.Id}");

        taskCategory.Update(command.Name, command.Description);
        await _taskCategoryRepository.SaveChangesAsync();

        return TaskCategoryDto.FromEntity(taskCategory);
    }
}