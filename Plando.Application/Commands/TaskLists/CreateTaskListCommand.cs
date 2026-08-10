namespace Plando.Application.Commands.TaskLists;

public record CreateTaskListCommand(string Name, Guid UserId);