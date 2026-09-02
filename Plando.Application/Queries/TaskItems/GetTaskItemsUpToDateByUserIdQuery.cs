namespace Plando.Application.Queries.TaskItems;

public record GetTaskItemsUpToDateByUserIdQuery(Guid UserId, DateTime Date, bool? IsCompleted);