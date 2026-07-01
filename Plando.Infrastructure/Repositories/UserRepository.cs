using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Infrastructure.Persistence;

namespace Plando.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly PlandoDbContext _db;

    public UserRepository(PlandoDbContext db)
    {
        _db = db;
    }

    public async Task<User?> GetByIdAsync(Guid id) =>
        await _db.Users.FindAsync(id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _db.Users.FirstOrDefaultAsync(o => o.Email == email);

    public Task AddAsync(User user)
    {
        _db.Users.Add(user);        

        return Task.CompletedTask;
    }

    public Task SaveChangesAsync() => _db.SaveChangesAsync();
}