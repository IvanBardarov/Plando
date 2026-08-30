using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskItemSchedules;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskItems;
using Plando.Application.Queries.TaskItemSchedules;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskItemSchedulesController : ControllerBase
{
    private readonly CreateTaskItemScheduleCommandHandler _createHandler;
    private readonly DeleteTaskItemScheduleCommandHandler _deleteHandler;
    private readonly UpdateTaskItemScheduleCommandHandler _updateHandler;
    private readonly GetTaskItemSchedulesByDateQueryHandler _getByDateQuery;
    private readonly GetTaskItemScheduleByIdQueryHandler _getByIdQuery;
    private readonly GetTaskItemByIdQueryHandler _getTaskItemByIdHandler;

    public TaskItemSchedulesController(
        CreateTaskItemScheduleCommandHandler createHandler,
        DeleteTaskItemScheduleCommandHandler deleteHandler,
        UpdateTaskItemScheduleCommandHandler updateHandler,
        GetTaskItemSchedulesByDateQueryHandler getByDateQuery,
        GetTaskItemScheduleByIdQueryHandler getByIdQuery,
        GetTaskItemByIdQueryHandler getTaskItemByIdHandler)
    {
        _createHandler = createHandler;
        _deleteHandler = deleteHandler;
        _updateHandler = updateHandler;
        _getByDateQuery = getByDateQuery;
        _getByIdQuery = getByIdQuery;
        _getTaskItemByIdHandler = getTaskItemByIdHandler;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<TaskItemScheduleDto>>
        GetByDate(DateTime date)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        return Ok(await _getByDateQuery
            .HandleAsync(new GetTaskItemSchedulesByDateQuery(userId, date)));
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskItemScheduleDto>>
        Create([FromBody] CreateTaskItemScheduleCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
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

        var taskItemScheduleDto = await _getByIdQuery
            .HandleAsync(new GetTaskItemScheduleByIdQuery(id));

        var taskItemDto = await _getTaskItemByIdHandler
            .HandleAsync(new GetTaskItemByIdQuery(taskItemScheduleDto.TaskItemId));

        if (taskItemDto.UserId != userId)
            return Forbid();

        await _deleteHandler.HandleAsync(new DeleteTaskItemScheduleCommand(id));

        return Ok();
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<ActionResult<TaskItemScheduleDto>> 
        Update([FromBody] UpdateTaskItemScheduleCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskItemScheduleDto = await _getByIdQuery
            .HandleAsync(new GetTaskItemScheduleByIdQuery(command.Id));

        var taskItemDto = await _getTaskItemByIdHandler
            .HandleAsync(new GetTaskItemByIdQuery(taskItemScheduleDto.TaskItemId));

        if (taskItemDto.UserId != userId)
            return Forbid();

        var newCommand = command with { UserId = userId };
        taskItemScheduleDto = await _updateHandler.HandleAsync(newCommand);

        return Ok(taskItemScheduleDto);
    }
}