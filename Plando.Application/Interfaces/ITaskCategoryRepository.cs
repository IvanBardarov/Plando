using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface ITaskCategoryRepository
{
    Task<TaskCategory?> GetByIdAsync(Guid id);
    Task<IEnumerable<TaskCategory>> GetAllByUserIdAsync(Guid userId);
    Task AddAsync(TaskCategory taskCategory);
    Task DeleteAsync(TaskCategory taskCategory);
    Task SaveChangesAsync();
}