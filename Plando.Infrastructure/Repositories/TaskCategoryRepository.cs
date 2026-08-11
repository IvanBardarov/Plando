using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class TaskCategoryRepository : ITaskCategoryRepository
{
    private readonly PlandoDbContext _db;

    public TaskCategoryRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<TaskCategory?> GetByIdAsync(Guid id) =>
        await _db.TaskCategories.FindAsync(id);

    public async Task<IEnumerable<TaskCategory>> GetAllByUserIdAsync(Guid userId)
        => await _db.TaskCategories
            .Where(o => o.UserId == userId)
            .ToListAsync();

    public Task AddAsync(TaskCategory taskCategory)
    {
        _db.TaskCategories.Add(taskCategory);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(TaskCategory taskCategory)
    {
        _db.TaskCategories.Remove(taskCategory);

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}