using Microsoft.AspNetCore.Mvc;
using Plando.Application.Commands.Users;
using Plando.Application.DTOs;
using Plando.Application.Queries.Users;

namespace Plando.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly RegisterUserCommandHandler _registerHandler;
    private readonly LoginUserCommandHandler _loginHandler;
    private readonly GetUserByIdQueryHandler _getUserByIdHandler;

    public UsersController(RegisterUserCommandHandler registerHandler,
        LoginUserCommandHandler loginHandler, GetUserByIdQueryHandler getUserByIdHandler)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
        _getUserByIdHandler = getUserByIdHandler;
    }

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterUserCommand command) =>
        await _registerHandler.HandleAsync(command);

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginUserCommand command) =>
        await _loginHandler.HandleAsync(command);

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id) =>
        await _getUserByIdHandler.HandleAsync(new GetUserByIdQuery(id));
}