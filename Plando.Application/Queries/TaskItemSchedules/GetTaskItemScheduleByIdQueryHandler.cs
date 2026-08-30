using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.TaskItemSchedules;

public class GetTaskItemScheduleByIdQueryHandler
{
    private readonly ITaskItemScheduleRepository _taskItemScheduleRepository;

    public GetTaskItemScheduleByIdQueryHandler(
        ITaskItemScheduleRepository taskItemScheduleRepository)
    {
        _taskItemScheduleRepository = taskItemScheduleRepository;
    }

    public async Task<TaskItemScheduleDto> 
        HandleAsync(GetTaskItemScheduleByIdQuery query)
    {
        var taskItemSchedule = await _taskItemScheduleRepository
            .GetByIdAsync(query.Id);

        if (taskItemSchedule is null)
            throw new DomainException($"Task item schedule with id: {query.Id}" +
                $" was not found!");

        return TaskItemScheduleDto.FromEntity(taskItemSchedule);
    }
}