using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskLists;

public class GetTaskListsByUserIdQueryHandler
{
    private readonly ITaskListRepository _taskListRepository;

    public GetTaskListsByUserIdQueryHandler(ITaskListRepository taskListRepository)
    {
        _taskListRepository = taskListRepository;
    }

    public async Task<IEnumerable<TaskListDto>> HandleAsync(GetTaskListsByUserIdQuery query)
    {
        var taskLists = await _taskListRepository.GetAllByUserIdAsync(query.UserId);

        if (taskLists is null || !taskLists.Any())
            return new List<TaskListDto>();

        var taskListDTOs = taskLists.Select(TaskListDto.FromEntity);

        return taskListDTOs;
    }
}