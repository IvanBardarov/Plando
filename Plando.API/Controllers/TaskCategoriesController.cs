using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.TaskCategories;
using Plando.Application.DTOs;
using Plando.Application.Queries.TaskCategories;
using System.Security.Claims;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskCategoriesController : ControllerBase
{
    private readonly GetTaskCategoryByIdQueryHandler _getByIdQueryHandler;
    private readonly GetTaskCategoriesByUserIdQueryHandler _getByUserIdQueryHandler;
    private readonly CreateTaskCategoryCommandHandler _createHandler;
    private readonly UpdateTaskCategoryCommandHandler _updateHandler;
    private readonly DeleteTaskCategoryCommandHandler _deleteHandler;

    public TaskCategoriesController(
        GetTaskCategoryByIdQueryHandler getyIdQueryHandler,
        GetTaskCategoriesByUserIdQueryHandler getByUserIdQueryHandler,
        CreateTaskCategoryCommandHandler createHandler,
        UpdateTaskCategoryCommandHandler updateHandler,
        DeleteTaskCategoryCommandHandler deleteHandler)
    {
        _getByIdQueryHandler = getyIdQueryHandler;
        _getByUserIdQueryHandler = getByUserIdQueryHandler;
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<TaskCategoryDto?>> GetById(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskCategoryDto = await _getByIdQueryHandler
            .HandleAsync(new GetTaskCategoryByIdQuery(id));

        if (taskCategoryDto.UserId != userId)
            return Forbid();

        return taskCategoryDto;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<TaskCategoryDto>> GetByUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskCategoryDTOs = await _getByUserIdQueryHandler
            .HandleAsync(new GetTaskCategoriesByUserIdQuery(userId));

        return Ok(taskCategoryDTOs);
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<TaskCategoryDto>>
        Create([FromBody] CreateTaskCategoryCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var newCommand = command with { UserId = userId };
        return await _createHandler.HandleAsync(newCommand);
    }


    [HttpPut]
    [Route("")]
    public async Task<ActionResult<TaskCategoryDto>> Update([FromBody] UpdateTaskCategoryCommand command)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskCategoryDto = await _getByIdQueryHandler.HandleAsync(new GetTaskCategoryByIdQuery(command.Id));
        if (taskCategoryDto.UserId != userId)
            return Forbid();

        taskCategoryDto = await _updateHandler.HandleAsync(command);

        return taskCategoryDto;
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var taskCategoryDto = await _getByIdQueryHandler
            .HandleAsync(new GetTaskCategoryByIdQuery(id));
        if (taskCategoryDto.UserId != userId)
            return Forbid();

        await _deleteHandler.HandleAsync(new DeleteTaskCategoryCommand(id));

        return Ok();
    }    
}