using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Notes;

public class CreateNoteCommandHandler
{
    private readonly INoteRepository _noteRepository;
    private readonly ITaskItemRepository _taskItemRepository;
    private readonly IUserRepository _userRepository;

    public CreateNoteCommandHandler(
        INoteRepository noteRepository,
        ITaskItemRepository taskItemRepository, 
        IUserRepository userRepository)
    {
        _noteRepository = noteRepository;
        _taskItemRepository = taskItemRepository;
        _userRepository = userRepository;
    }

    public async Task<NoteDto> HandleAsync(CreateNoteCommand command)
    {
        var taskItem = await _taskItemRepository.GetByIdAsync(command.TaskItemId);
        if (taskItem is null)
            throw new DomainException("There is no such a task item!");

        var user = await _userRepository.GetByIdAsync(command.UserId);
        if (user is null)
            throw new DomainException("There is not such an user!");

        var note = Note.Create(command.Content, command.TaskItemId, command.UserId);

        await _noteRepository.AddAsync(note);
        await _noteRepository.SaveChangesAsync();

        return NoteDto.FromEntity(note);
    }
}