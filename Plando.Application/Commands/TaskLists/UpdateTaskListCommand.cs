using Plando.Domain.Enums;

namespace Plando.Application.Commands.TaskLists;

public record UpdateTaskListCommand(Guid Id, string Name, TaskListColor Color);