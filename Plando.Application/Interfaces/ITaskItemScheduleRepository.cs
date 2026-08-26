using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface ITaskItemScheduleRepository
{
    Task<TaskItemSchedule?> GetByIdAsync(Guid id);
    Task<IEnumerable<TaskItemSchedule>> GetAllByDateAsync(Guid userId, DateTime date);
    Task AddAsync(TaskItemSchedule taskItemSchedule);
    Task DeleteAsync(TaskItemSchedule taskItemSchedule);
    Task SaveChangesAsync();
}