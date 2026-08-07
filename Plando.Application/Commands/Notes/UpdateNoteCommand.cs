namespace Plando.Application.Commands.Notes;

public record UpdateNoteCommand(Guid Id, string Content);