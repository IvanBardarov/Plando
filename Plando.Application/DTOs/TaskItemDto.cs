using Plando.Domain.Entities;

namespace Plando.Application.DTOs
{
    public class TaskItemDto
    {
        private TaskItemDto(TaskItem taskItem)
        {
            if (taskItem is null)
                throw new ArgumentNullException(nameof(taskItem));

            this.Id = taskItem.Id;
            this.Title = taskItem.Title;
            this.Description = taskItem.Description;
            this.DueDate = taskItem.DueDate;
            this.IsCompleted = taskItem.IsCompleted;
            this.CreatedAt = taskItem.CreatedAt;
            this.UserId = taskItem.UserId;
            this.TaskListId = taskItem.TaskListId;
            this.CompletedAt = taskItem.CompletedAt;
        }

        public static TaskItemDto FromEntity(TaskItem taskItem)
        {
            return new TaskItemDto(taskItem);
        }

        public Guid Id { get; init; }
        public string? Title { get; init; }
        public string? Description { get; init; }
        public DateTime DueDate { get; init; }
        public bool IsCompleted { get; init; }
        public DateTime CreatedAt { get; init; }
        public Guid UserId { get; init; }
        public Guid? TaskListId { get; init; }
        public DateTime? CompletedAt { get; init; }
    }
}