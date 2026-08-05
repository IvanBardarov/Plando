namespace Plando.Application.Commands.Notes;

public record CreateNoteCommand(string Content, Guid TaskItemId, Guid UserId);