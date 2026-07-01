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

    public async Task<IEnumerable<TaskItem>> GetAllByUserIdAsync(Guid userId) =>
        await _db.TaskItems
            .Where(o => o.UserId == userId)
            .ToListAsync();

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