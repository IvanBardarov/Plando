using Microsoft.EntityFrameworkCore;
using Plando.Domain.Entities;

namespace Plando.Infrastructure.Persistence;

public class PlandoDbContext : DbContext
{
    public PlandoDbContext(DbContextOptions<PlandoDbContext> options) : base(options)
    {
    }

    public required DbSet<User> Users { get; set; }
    public required DbSet<TaskItem> TaskItems { get; set; }
    public required DbSet<TaskList> TaskLists { get; set; }
    public required DbSet<Note> Notes { get; set; }
    public required DbSet<TaskCategory> TaskCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PlandoDbContext).Assembly);
    }
}