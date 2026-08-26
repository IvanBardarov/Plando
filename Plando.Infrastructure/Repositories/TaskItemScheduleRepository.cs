using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class TaskItemScheduleRepository : ITaskItemScheduleRepository
{
    private readonly PlandoDbContext _db;

    public TaskItemScheduleRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<TaskItemSchedule?> GetByIdAsync(Guid id) =>
        await _db.TaskItemSchedules.FindAsync(id);

    public async Task<IEnumerable<TaskItemSchedule>>
        GetAllByTaskItemIdAsync(Guid taskItemId, DateTime date) =>
        await _db.TaskItemSchedules
            .Where(o => o.TaskItemId == taskItemId && o.Date == date)
            .ToListAsync();

    public Task AddAsync(TaskItemSchedule taskItemSchedule)
    {
        _db.TaskItemSchedules.Add(taskItemSchedule);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(TaskItemSchedule taskItemSchedule)
    {
        _db.TaskItemSchedules.Remove(taskItemSchedule);

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}