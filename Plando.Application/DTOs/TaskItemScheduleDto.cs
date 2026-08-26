using Plando.Domain.Entities;

namespace Plando.Application.DTOs;

public class TaskItemScheduleDto
{
    private TaskItemScheduleDto(TaskItemSchedule taskItemSchedule)
    {
        if (taskItemSchedule is null)
            throw new ArgumentNullException(nameof(taskItemSchedule));

        Id = taskItemSchedule.Id;
        TaskItemId = taskItemSchedule.TaskItemId;
        Date = taskItemSchedule.Date;
        StartTime = taskItemSchedule.StartTime;
        EndTime = taskItemSchedule.EndTime;
    }

    public static TaskItemScheduleDto FromEntity(TaskItemSchedule taskItemSchedule)
    {
        return new TaskItemScheduleDto(taskItemSchedule);
    }

    public Guid Id { get; init; }
    public Guid TaskItemId { get; init; }
    public DateTime Date { get; init; }
    public TimeSpan StartTime { get; init; }
    public TimeSpan EndTime { get; init; }
}