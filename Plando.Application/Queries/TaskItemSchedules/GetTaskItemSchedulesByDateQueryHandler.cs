using Plando.Application.DTOs;
using Plando.Application.Interfaces;

namespace Plando.Application.Queries.TaskItemSchedules;

public class GetTaskItemSchedulesByDateQueryHandler
{
    private readonly ITaskItemScheduleRepository _taskItemScheduleRepository;

    public GetTaskItemSchedulesByDateQueryHandler(
        ITaskItemScheduleRepository taskItemScheduleRepository)
    {
        _taskItemScheduleRepository = taskItemScheduleRepository;
    }

    public async Task<IEnumerable<TaskItemScheduleDto>> 
        HandleAsync(GetTaskItemSchedulesByDateQuery query)
    {
        var taskItemSchedules = await _taskItemScheduleRepository
            .GetAllByDateAsync(query.UserId, query.Date);

        return taskItemSchedules.Select(TaskItemScheduleDto.FromEntity);
    }
}