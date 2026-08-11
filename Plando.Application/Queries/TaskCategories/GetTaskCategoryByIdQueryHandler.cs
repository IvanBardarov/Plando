using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.TaskCategories;

public class GetTaskCategoryByIdQueryHandler
{
    private readonly ITaskCategoryRepository _taskCategoryRepository;

    public GetTaskCategoryByIdQueryHandler(
        ITaskCategoryRepository taskCategoryRepository)
    {
        _taskCategoryRepository = taskCategoryRepository;
    }

    public async Task<TaskCategoryDto> 
        HandleAsync(GetTaskCategoryByIdQuery query)
    {
        var taskCategory = await _taskCategoryRepository.GetByIdAsync(query.Id);
        if (taskCategory is null)
            throw new DomainException("There is no such a task category" +
                $" with id: {query.Id}");

        return TaskCategoryDto.FromEntity(taskCategory);
    }
}