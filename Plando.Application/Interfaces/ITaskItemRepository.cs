using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface ITaskItemRepository
{
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task<IEnumerable<TaskItem>> GetAllByUserIdAsync(
        Guid userId, DateTime? DateFrom = null, DateTime? DateTo = null);
    Task AddAsync(TaskItem taskItem);
    Task DeleteAsync(TaskItem taskItem);
    Task SaveChangesAsync();
}