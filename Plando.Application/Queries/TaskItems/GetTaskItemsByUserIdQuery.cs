namespace Plando.Application.Queries.TaskItems;

public record GetTaskItemsByUserIdQuery(
    Guid UserId,
    string? Title,
    string? Description,
    DateTime? CreatedAtFrom,
    DateTime? CreatedAtTo,
    DateTime? DueDateFrom,
    DateTime? DueDateTo,
    DateTime? CompletedAtFrom,
    DateTime? CompletedAtTo,
    bool? IsCompleted,
    int? Page,
    int? PageSize);