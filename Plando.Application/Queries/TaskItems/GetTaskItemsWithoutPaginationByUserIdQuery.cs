namespace Plando.Application.Queries.TaskItems;

public record GetTaskItemsWithoutPaginationByUserIdQuery(
    Guid UserId,
    DateTime? DateFrom,
    DateTime? DateTo);