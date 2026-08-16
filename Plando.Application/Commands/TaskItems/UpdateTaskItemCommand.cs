namespace Plando.Application.Commands.TaskItems;

public record UpdateTaskItemCommand(
    Guid Id,
    string Title, 
    string Description, 
    DateTime? StartDate,
    DateTime DueDate,
    Guid? TaskListId,
    Guid? CategoryId);