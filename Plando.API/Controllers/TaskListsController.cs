using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskLists;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskLists;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
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
    [Route("{userId}")]
    public async Task<ActionResult<IEnumerable<TaskListDto>>> GetByUserId(Guid userId) =>
        Ok(await _getQuery.HandleAsync(new GetTaskListsByUserIdQuery(userId)));

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskListDto>> Create([FromBody] CreateTaskListCommand command) =>
        await _createHandler.HandleAsync(command);

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(Guid id) =>
        await _deleteHandler.HandleAsync(new DeleteTaskListCommand(id));
}