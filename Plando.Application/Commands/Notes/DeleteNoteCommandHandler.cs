using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Notes;

public class DeleteNoteCommandHandler
{
    private readonly INoteRepository _noteRepository;

    public DeleteNoteCommandHandler(INoteRepository noteRepository)
    {
        _noteRepository = noteRepository;
    }

    public async Task HandleAsync(DeleteNoteCommand command)
    {
        var note = await _noteRepository.GetByIdAsync(command.NoteId);

        if (note is null)
            throw new DomainException($"There is no such a note with id: {command.NoteId}");

        await _noteRepository.DeleteAsync(note);
        await _noteRepository.SaveChangesAsync();
    }
}