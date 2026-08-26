using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface ITaskItemScheduleRepository
{
    Task<TaskItemSchedule?> GetByIdAsync(Guid id);
    Task<IEnumerable<TaskItemSchedule>> GetAllByTaskItemIdAsync(
        Guid taskItemId, DateTime date);
    Task AddAsync(TaskItemSchedule taskItemSchedule);
    Task DeleteAsync(TaskItemSchedule taskItemSchedule);
    Task SaveChangesAsync();
}