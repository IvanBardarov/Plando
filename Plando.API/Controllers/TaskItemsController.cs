using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskItems;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskItems;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskItemsController : ControllerBase
{
    private readonly GetTaskItemsByUserIdQueryHandler _getTaskByUserIdQuery;
    private readonly CreateTaskItemCommandHandler _createHandler;
    private readonly CompleteTaskItemCommandHandler _completeHandler;
    private readonly DeleteTaskItemCommandHandler _deleteHandler;
    private readonly GetTaskItemByIdQueryHandler _getTaskByIdQuery;

    public TaskItemsController(GetTaskItemsByUserIdQueryHandler getTaskByUserIdQuery,
        CreateTaskItemCommandHandler createHandler,
        CompleteTaskItemCommandHandler completeHandler,
        DeleteTaskItemCommandHandler deleteHandler,
        GetTaskItemByIdQueryHandler getTaskByIdQuery)
    {
        _getTaskByUserIdQuery = getTaskByUserIdQuery;
        _createHandler = createHandler;
        _completeHandler = completeHandler;
        _deleteHandler = deleteHandler;
        _getTaskByIdQuery = getTaskByIdQuery;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<PagedResultDto<TaskItemDto>>> GetByUserId(
        Guid? taskListId,
        string? title,
        string? description,
        DateTime? createdAtFrom,
        DateTime? createdAtTo,
        DateTime? dueDateFrom,
        DateTime? dueDateTo,
        DateTime? completedAtFrom,
        DateTime? completedAtTo,
        bool? isCompleted,
        int? page,
        int? pageSize)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        return Ok(await _getTaskByUserIdQuery.HandleAsync(new GetTaskItemsByUserIdQuery(
        userId,
        taskListId,
        title,
        description,
        createdAtFrom,
        createdAtTo,
        dueDateFrom,
        dueDateTo,
        completedAtFrom,
        completedAtTo,
        isCompleted,
        page,
        pageSize
        )));
    }

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

    [HttpGet]
    [Route("{id}/details")]
    public async Task<ActionResult<TaskItemDto>> Details(Guid id) =>
        await _getTaskByIdQuery.HandleAsync(new GetTaskItemByIdQuery(id));
}