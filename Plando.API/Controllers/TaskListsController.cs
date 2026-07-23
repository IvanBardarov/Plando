using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskLists;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskLists;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskListsController : ControllerBase
{
    private readonly GetTaskListsByUserIdQueryHandler _getQuery;
    private readonly CreateTaskListCommandHandler _createHandler;
    private readonly DeleteTaskListCommandHandler _deleteHandler;

    public TaskListsController(GetTaskListsByUserIdQueryHandler getQuery,
        CreateTaskListCommandHandler createHandler,
        DeleteTaskListCommandHandler deleteHandler)
    {
        _getQuery = getQuery;
        _createHandler = createHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<IEnumerable<TaskListDto>>> GetByUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        return Ok(await _getQuery.HandleAsync(new GetTaskListsByUserIdQuery(userId)));
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskListDto>> Create([FromBody] CreateTaskListCommand command) =>
        await _createHandler.HandleAsync(command);

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(Guid id) =>
        await _deleteHandler.HandleAsync(new DeleteTaskListCommand(id));
}