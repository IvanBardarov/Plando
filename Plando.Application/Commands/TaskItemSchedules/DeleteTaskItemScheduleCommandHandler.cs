using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.TaskItemSchedules;

public class DeleteTaskItemScheduleCommandHandler
{
    private readonly ITaskItemScheduleRepository _taskItemScheduleRepository;
    
    public DeleteTaskItemScheduleCommandHandler(
        ITaskItemScheduleRepository taskItemScheduleRepository)
    {
        _taskItemScheduleRepository = taskItemScheduleRepository;
    }

    public async Task HandleAsync(DeleteTaskItemScheduleCommand command)
    {
        var taskItemSchedule = await _taskItemScheduleRepository
            .GetByIdAsync(command.Id);

        if (taskItemSchedule is null)
            throw new DomainException($"Task item schedule with id:{command.Id}" +
                $" was not found!");

        await _taskItemScheduleRepository.DeleteAsync(taskItemSchedule);
        await _taskItemScheduleRepository.SaveChangesAsync();
    }
}