using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskCategories;

public class GetTaskCategoriesByUserIdQueryHandler
{
    private readonly ITaskCategoryRepository _taskCategoryRepository;

    public GetTaskCategoriesByUserIdQueryHandler(
        ITaskCategoryRepository taskCategoryRepository)
    {
        _taskCategoryRepository = taskCategoryRepository;
    }

    public async Task<IEnumerable<TaskCategoryDto>> 
        HandleAsync(GetTaskCategoriesByUserIdQuery query)
    {
        var taskCategories = await _taskCategoryRepository
            .GetAllByUserIdAsync(query.UserId);

        return taskCategories.Select(TaskCategoryDto.FromEntity);
    }
}