namespace Plando.Application.Queries.TaskItemSchedules;

public record GetTaskItemSchedulesByDateQuery(
    Guid UserId,
    DateTime Date);