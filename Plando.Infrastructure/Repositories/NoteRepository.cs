using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class NoteRepository : INoteRepository
{
    private readonly PlandoDbContext _db;

    public NoteRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<Note?> GetByIdAsync(Guid id) => await _db.Notes.FindAsync(id);

    public async Task<IEnumerable<Note>> GetAllByTaskItemIdAsync(Guid taskItemId) =>
        await _db.Notes.Where(note => note.TaskItemId == taskItemId).ToListAsync();

    public Task AddAsync(Note note)
    {
        _db.Notes.Add(note);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Note note)
    {
        _db.Notes.Remove(note);

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}