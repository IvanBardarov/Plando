namespace Plando.Application.Commands.TaskItemSchedules;

public record UpdateTaskItemScheduleCommand(
    Guid Id,
    Guid UserId,
    Guid TaskItemId,
    DateTime Date,
    TimeSpan StartTime,
    TimeSpan EndTime);