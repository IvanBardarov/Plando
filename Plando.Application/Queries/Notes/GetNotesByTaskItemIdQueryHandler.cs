using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.Notes;

public class GetNotesByTaskItemIdQueryHandler
{
    private readonly INoteRepository _noteRepository;

    public GetNotesByTaskItemIdQueryHandler(INoteRepository noteRepository)
    {
        _noteRepository = noteRepository;
    }

    public async Task<IEnumerable<NoteDto>> HandleAsync(GetNotesByTaskItemIdQuery query)
    {
        var notes = await _noteRepository.GetAllByTaskItemIdAsync(query.TaskItemId);

        return notes.Select(NoteDto.FromEntity);
    }
}