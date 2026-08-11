using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskCategories;

public class DeleteTaskCategoryCommandHandler
{
    private readonly ITaskCategoryRepository _taskCategoryRepository;

    public DeleteTaskCategoryCommandHandler(
        ITaskCategoryRepository taskCategoryRepository)
    {
        _taskCategoryRepository = taskCategoryRepository;
    }

    public async Task HandleAsync(DeleteTaskCategoryCommand command)
    {
        var taskCategory = await _taskCategoryRepository.GetByIdAsync(command.Id);
        if (taskCategory is null)
            throw new DomainException("There is no such a task category" +
                $" with id: {command.Id}");

        await _taskCategoryRepository.DeleteAsync(taskCategory);
        await _taskCategoryRepository.SaveChangesAsync();
    }
}