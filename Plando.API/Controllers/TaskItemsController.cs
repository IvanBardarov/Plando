using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskItems;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskItems;
using Plando.Domain.Exceptions;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskItemsController : ControllerBase
{
    private readonly GetTaskItemsByUserIdQueryHandler _getTaskByUserIdQuery;
    private readonly GetTaskItemsWithoutPaginationByUserIdQueryHandler
        _getTasksWithoutPaginationByUserIdQuery;
    private readonly CreateTaskItemCommandHandler _createHandler;
    private readonly CompleteTaskItemCommandHandler _completeHandler;
    private readonly DeleteTaskItemCommandHandler _deleteHandler;
    private readonly GetTaskItemByIdQueryHandler _getTaskByIdQuery;
    private readonly UpdateTaskItemCommandHandler _updateHandler;

    public TaskItemsController(GetTaskItemsByUserIdQueryHandler getTaskByUserIdQuery,
        GetTaskItemsWithoutPaginationByUserIdQueryHandler
        getTasksWithoutPaginationByUserIdQuery,
        CreateTaskItemCommandHandler createHandler,
        CompleteTaskItemCommandHandler completeHandler,
        DeleteTaskItemCommandHandler deleteHandler,
        GetTaskItemByIdQueryHandler getTaskByIdQuery,
        UpdateTaskItemCommandHandler updateHandler)
    {
        _getTaskByUserIdQuery = getTaskByUserIdQuery;
        _getTasksWithoutPaginationByUserIdQuery = getTasksWithoutPaginationByUserIdQuery;
        _createHandler = createHandler;
        _completeHandler = completeHandler;
        _deleteHandler = deleteHandler;
        _getTaskByIdQuery = getTaskByIdQuery;
        _updateHandler = updateHandler;
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

    [HttpGet]
    [Route("WithoutPagination")]
    public async Task<ActionResult<IEnumerable<TaskItemDto>>>
        GetWithoutPaginationByUserId(
        [FromQuery] GetTaskItemsWithoutPaginationByUserIdQuery query)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var newQuery = query with { UserId = userId };
        return Ok(await _getTasksWithoutPaginationByUserIdQuery
            .HandleAsync(newQuery));
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskItemDto>> Create([FromBody] CreateTaskItemCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var newCommand = command with { UserId = userId };
        return await _createHandler.HandleAsync(newCommand);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemDto = await _getTaskByIdQuery.HandleAsync(new GetTaskItemByIdQuery(id));
        if (taskItemDto.UserId != userId)
            return Forbid();

        await _deleteHandler.HandleAsync(new DeleteTaskItemCommand(id));

        return Ok();
    }

    [HttpPut]
    [Route("{id}/complete")]
    public async Task<ActionResult<TaskItemDto>> Complete(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemDto = await _getTaskByIdQuery.HandleAsync(new GetTaskItemByIdQuery(id));
        if (taskItemDto.UserId != userId)
            return Forbid();

        taskItemDto = await _completeHandler.HandleAsync(new CompleteTaskItemCommand(id));

        return Ok(taskItemDto);
    }


    [HttpGet]
    [Route("{id}/details")]
    public async Task<ActionResult<TaskItemDto>> Details(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemDto = await _getTaskByIdQuery.HandleAsync(new GetTaskItemByIdQuery(id));
        if (taskItemDto.UserId != userId)
            return Forbid();

        return Ok(taskItemDto);
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<ActionResult<TaskItemDto>> Update([FromBody] UpdateTaskItemCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemDto = await _getTaskByIdQuery
            .HandleAsync(new GetTaskItemByIdQuery(command.Id));
        if (taskItemDto.UserId != userId)
            return Forbid();

        taskItemDto = await _updateHandler.HandleAsync(command);

        return Ok(taskItemDto);
    }
}