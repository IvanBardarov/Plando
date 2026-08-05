using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;
public interface INoteRepository
{
    Task<Note?> GetByIdAsync(Guid id);
    Task<IEnumerable<Note>> GetAllByTaskItemIdAsync(Guid taskItemId);
    Task AddAsync(Note note);
    Task DeleteAsync(Note note);
    Task SaveChangesAsync();
}