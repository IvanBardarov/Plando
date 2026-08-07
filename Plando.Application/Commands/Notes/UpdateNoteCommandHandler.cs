using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Notes;

public class UpdateNoteCommandHandler
{
    private readonly INoteRepository _noteRepository;

    public UpdateNoteCommandHandler(INoteRepository noteRepository)
    {
        _noteRepository = noteRepository;
    }

    public async Task<NoteDto> HandleAsync(UpdateNoteCommand command)
    {
        var note = await _noteRepository.GetByIdAsync(command.Id);
        if (note is null)
            throw new DomainException($"There is no such a note with id: {command.Id}");

        note.Update(command.Content);
        await _noteRepository.SaveChangesAsync();

        return NoteDto.FromEntity(note);
    }
}