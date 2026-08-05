using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.Notes;

public class GetNoteByIdQueryHandler
{
    private readonly INoteRepository _noteRepository;

    public GetNoteByIdQueryHandler(INoteRepository noteRepository)
    {
        _noteRepository = noteRepository;
    }

    public async Task<NoteDto> HandleAsync(Guid id)
    {
        var note = await _noteRepository.GetByIdAsync(id);
        if (note is null)
            throw new DomainException($"There is no such a note with id: {id}!");

        return NoteDto.FromEntity(note);
    }    
}