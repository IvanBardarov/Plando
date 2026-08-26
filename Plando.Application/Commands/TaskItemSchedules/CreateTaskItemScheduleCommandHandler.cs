using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItemSchedules;

public class CreateTaskItemScheduleCommandHandler
{
    private readonly ITaskItemScheduleRepository _taskItemScheduleRepository;

    public CreateTaskItemScheduleCommandHandler(
        ITaskItemScheduleRepository taskItemScheduleRepository)
    {
        _taskItemScheduleRepository = taskItemScheduleRepository;
    }

    public async Task<TaskItemScheduleDto>
        HandleAsync(CreateTaskItemScheduleCommand command)
    {
        var taskItemSchedule = TaskItemSchedule
            .Create(command.TaskItemId, command.Date, command.StartTime, command.EndTime);

        var existingTaskItemSchedules = await _taskItemScheduleRepository
            .GetAllByDateAsync(command.UserId, command.Date);

        foreach (var existingTaskItemSchedule in existingTaskItemSchedules)
        {
            if (taskItemSchedule.StartTime < existingTaskItemSchedule.EndTime &&
                taskItemSchedule.EndTime > existingTaskItemSchedule.StartTime)
                throw new DomainException("You can not schedule a task over" +
                    " the already scheduled task!");
        }

        await _taskItemScheduleRepository.AddAsync(taskItemSchedule);
        await _taskItemScheduleRepository.SaveChangesAsync();

        return TaskItemScheduleDto.FromEntity(taskItemSchedule);
    }
}