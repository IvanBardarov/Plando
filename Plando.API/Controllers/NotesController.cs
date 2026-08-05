using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.Notes;
using Plando.Application.DTOs;
using Plando.Application.Queries.Notes;
using Plando.Application.Queries.TaskItems;
using Plando.Domain.Exceptions;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly CreateNoteCommandHandler _createNoteCommandHandler;
    private readonly DeleteNoteCommandHandler _deleteNoteCommandHandler;
    private readonly GetNotesByTaskItemIdQueryHandler _getNotesByTaskItemIdQueryHandler;
    private readonly GetNoteByIdQueryHandler _getNoteByIdQueryHandler;
    private readonly GetTaskItemByIdQueryHandler _getTaskItemByIdQueryHandler;

    public NotesController(
        CreateNoteCommandHandler createNoteCommandHandler,
        DeleteNoteCommandHandler deleteNoteCommandHandler,
        GetNotesByTaskItemIdQueryHandler getNotesByTaskItemIdQueryHandler,
        GetNoteByIdQueryHandler getNoteByIdQueryHandler,
        GetTaskItemByIdQueryHandler getTaskItemByIdQueryHandler)
    {
        _createNoteCommandHandler = createNoteCommandHandler;
        _deleteNoteCommandHandler = deleteNoteCommandHandler;
        _getNotesByTaskItemIdQueryHandler = getNotesByTaskItemIdQueryHandler;
        _getNoteByIdQueryHandler = getNoteByIdQueryHandler;
        _getTaskItemByIdQueryHandler = getTaskItemByIdQueryHandler;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<IEnumerable<NoteDto>>> GetByTaskItemId(Guid taskItemId)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemDto = await _getTaskItemByIdQueryHandler
            .HandleAsync(new GetTaskItemByIdQuery(taskItemId));

        if (taskItemDto.UserId != userId)
            return Forbid();

        var noteDTOs = await _getNotesByTaskItemIdQueryHandler
            .HandleAsync(new GetNotesByTaskItemIdQuery(taskItemId));

        return Ok(noteDTOs);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<NoteDto>> GetById(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var note = await _getNoteByIdQueryHandler.HandleAsync(id);
        if (note.UserId != userId)
            return Forbid();

        return note;
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<NoteDto>> Create([FromBody] CreateNoteCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var newCommand = command with { UserId = userId };
        return await _createNoteCommandHandler.HandleAsync(newCommand);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var note = await _getNoteByIdQueryHandler.HandleAsync(id);
        if (note.UserId != userId)
            return Forbid();

        await _deleteNoteCommandHandler.HandleAsync(new DeleteNoteCommand(id));

        return Ok();
    }
}