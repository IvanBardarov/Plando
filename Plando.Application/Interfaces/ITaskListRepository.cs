using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface ITaskListRepository
{
    Task<TaskList?> GetByIdAsync(Guid id);
    Task<IEnumerable<TaskList>> GetAllByUserIdAsync(Guid userId);
    Task AddAsync(TaskList taskList);
    Task DeleteAsync(TaskList taskList);
    Task SaveChangesAsync();
}