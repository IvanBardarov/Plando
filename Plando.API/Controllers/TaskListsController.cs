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
    private readonly GetTaskListsByUserIdQueryHandler _getByUserIdQuery;
    private readonly GetTaskListByIdQueryHandler _getByIdQuery;
    private readonly CreateTaskListCommandHandler _createHandler;
    private readonly UpdateTaskListCommandHandler _updateHandler;
    private readonly DeleteTaskListCommandHandler _deleteHandler;

    public TaskListsController(GetTaskListsByUserIdQueryHandler getByUserIdQuery,
        GetTaskListByIdQueryHandler getByIdQuery,
        CreateTaskListCommandHandler createHandler,
        UpdateTaskListCommandHandler updateHandler,
        DeleteTaskListCommandHandler deleteHandler)
    {
        _getByUserIdQuery = getByUserIdQuery;
        _getByIdQuery = getByIdQuery;
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<IEnumerable<TaskListDto>>> GetByUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        return Ok(await _getByUserIdQuery.HandleAsync(new GetTaskListsByUserIdQuery(userId)));
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<TaskListDto>> GetById(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var taskListDto = await _getByIdQuery.HandleAsync(new GetTaskListByIdQuery(id));
        if (taskListDto.UserId != userId)
            return Forbid();

        return taskListDto;
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskListDto>> Create([FromBody] CreateTaskListCommand command) =>
        await _createHandler.HandleAsync(command);

    [HttpPut]
    [Route("")]
    public async Task<ActionResult<TaskListDto>> Update([FromBody] UpdateTaskListCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskListDto = await _getByIdQuery.HandleAsync(new GetTaskListByIdQuery(command.Id));
        if (taskListDto.UserId != userId)
            return Forbid();

        taskListDto = await _updateHandler.HandleAsync(command);

        return taskListDto;
    }    

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(Guid id) =>
        await _deleteHandler.HandleAsync(new DeleteTaskListCommand(id));
}