namespace Plando.Application.Commands.TaskItemSchedules;

public record CreateTaskItemScheduleCommand(
    Guid UserId,
    Guid TaskItemId, 
    DateTime Date, 
    TimeSpan StartTime, 
    TimeSpan EndTime);