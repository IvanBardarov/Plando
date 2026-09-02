using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class TaskItemRepository : ITaskItemRepository
{
    private readonly PlandoDbContext _db;

    public TaskItemRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id) =>
        await _db.TaskItems.FindAsync(id);

    public async Task<IEnumerable<TaskItem>>
        GetAllByUserIdAsync(
            Guid userId, DateTime? dateFrom = null, DateTime? dateTo = null)
    {
        var query = _db.TaskItems.Where(o => o.UserId == userId);

        if (dateFrom is not null)
            query = query
                .Where(o => (o.StartDate != null && o.StartDate!.Value.Date >= dateFrom.Value.Date) ||
                    (o.StartDate == null && o.CreatedAt.Date >= dateFrom.Value.Date));
        if (dateTo is not null)
            query = query
                .Where(o => (o.StartDate != null && o.StartDate!.Value.Date <= dateTo.Value.Date) ||
                    (o.StartDate == null && o.CreatedAt.Date <= dateTo.Value.Date));

        var result = await query.ToListAsync();
        return result;
    }

    public async Task<IEnumerable<TaskItem>> GetAllByUserUpToDateAsync(
    Guid userId, DateTime date, bool? isCompleted = null)
    {
        var query = _db.TaskItems.Where(o => o.UserId == userId);

        query = query
            .Where(o => (o.StartDate != null && o.StartDate!.Value.Date <= date.Date) ||
                (o.StartDate == null && o.CreatedAt.Date <= date.Date));

        if (isCompleted is not null)
            query = query.Where(o => o.IsCompleted == isCompleted);

        var result = await query.ToListAsync();
        return result;
    }

    public Task AddAsync(TaskItem taskItem)
    {
        _db.TaskItems.Add(taskItem);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(TaskItem taskItem)
    {
        _db.TaskItems.Remove(taskItem);

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}