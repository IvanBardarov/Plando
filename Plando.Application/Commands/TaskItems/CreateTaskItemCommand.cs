namespace Plando.Application.Commands.TaskItems;

public record CreateTaskItemCommand(
    string Title,
    string Description,
    Guid UserId,
    DateTime DueDate,
    Guid? TaskListId,
    DateTime? StartDate,
    Guid? CategoryId);