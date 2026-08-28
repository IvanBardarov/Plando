using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItemSchedules;

public class UpdateTaskItemScheduleCommandHandler
{
    private readonly ITaskItemScheduleRepository _taskItemScheduleRepository;

    public UpdateTaskItemScheduleCommandHandler(
        ITaskItemScheduleRepository taskItemScheduleRepository)
    {
        _taskItemScheduleRepository = taskItemScheduleRepository;
    }

    public async Task<TaskItemScheduleDto>
        HandleAsync(UpdateTaskItemScheduleCommand command)
    {
        var taskItemSchedule = await _taskItemScheduleRepository.GetByIdAsync(command.Id);

        if (taskItemSchedule is null)
            throw new DomainException($"Task item schedule with id:{command.Id}" +
                $" was not found!");

        var taskItemSchedules = await _taskItemScheduleRepository
            .GetAllByDateAsync(command.UserId, command.Date);

        taskItemSchedules = [..taskItemSchedules
            .Where(t => t.Id != taskItemSchedule.Id)];

        foreach(var t in taskItemSchedules)
        {
            if(command.StartTime < t.EndTime && command.EndTime > t.StartTime)
                throw new DomainException("You can not reschedule a task over" +
                    " the another already scheduled task!");
        }

        taskItemSchedule.Update(
            command.Date, 
            command.StartTime, 
            command.EndTime);

        await _taskItemScheduleRepository.SaveChangesAsync();

        return TaskItemScheduleDto.FromEntity(taskItemSchedule);
    }
}