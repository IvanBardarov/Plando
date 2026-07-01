using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class TaskListRepository : ITaskListRepository
{
    private readonly PlandoDbContext _db;

    public TaskListRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<TaskList?> GetByIdAsync(Guid id) =>
        await _db.TaskLists.FindAsync(id);

    public async Task<IEnumerable<TaskList>> GetAllByUserIdAsync(Guid userId) =>
        await _db.TaskLists
            .Where(o => o.UserId == userId)
            .ToListAsync();

    public Task AddAsync(TaskList taskList)
    {
        _db.TaskLists.Add(taskList);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(TaskList taskList)
    {
        _db.TaskLists.Remove(taskList);

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}