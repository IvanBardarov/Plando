using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskItems;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskItems;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskItemsController : ControllerBase
{
    private readonly GetTaskItemsByUserIdQueryHandler _getQuery;
    private readonly CreateTaskItemCommandHandler _createHandler;
    private readonly CompleteTaskItemCommandHandler _completeHandler;
    private readonly DeleteTaskItemCommandHandler _deleteHandler;

    public TaskItemsController(GetTaskItemsByUserIdQueryHandler getQuery,
        CreateTaskItemCommandHandler createHandler,
        CompleteTaskItemCommandHandler completeHandler,
        DeleteTaskItemCommandHandler deleteHandler)
    {
        _getQuery = getQuery;
        _createHandler = createHandler;
        _completeHandler = completeHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [Route("{userId}")]
    public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetByUserId(Guid userId) =>
        Ok(await _getQuery.HandleAsync(new GetTaskItemsByUserIdQuery(userId)));

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskItemDto>> Create([FromBody] CreateTaskItemCommand command) =>
        await _createHandler.HandleAsync(command);

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(Guid id) =>
        await _deleteHandler.HandleAsync(new DeleteTaskItemCommand(id));

    [HttpPut]
    [Route("{id}/complete")]
    public async Task<ActionResult<TaskItemDto>> Complete(Guid id) =>
        await _completeHandler.HandleAsync(new CompleteTaskItemCommand(id));
}