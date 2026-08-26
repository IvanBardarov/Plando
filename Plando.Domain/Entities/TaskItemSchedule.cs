using Plando.Domain.Exceptions;

namespace Plando.Domain.Entities;

public class TaskItemSchedule
{
    private TaskItemSchedule() { }

    public static TaskItemSchedule Create(
        Guid taskItemId, DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        Validate(startTime, endTime);

        return new TaskItemSchedule
        {
            Id = Guid.NewGuid(),
            TaskItemId = taskItemId,
            Date = date,
            StartTime = startTime,
            EndTime = endTime
        };
    }

    private static void Validate(TimeSpan startTime, TimeSpan endTime)
    {
        if (endTime < startTime)
            throw new DomainException("End time of the task can not be " +
                "earlier than start time!");
    }

    public void Update(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        Validate(startTime, endTime);

        Date = date;
        StartTime = startTime;
        EndTime = endTime;
    }

    public Guid Id { get; private set; }
    public Guid TaskItemId { get; private set; }
    public DateTime Date { get; private set; }
    public TimeSpan StartTime { get; private set; }
    public TimeSpan EndTime { get; private set; }
    public TaskItem? TaskItem { get; private set; }
}