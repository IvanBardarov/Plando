using Moq;
using Plando.Application.Commands.Users;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class RegisterUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly RegisterUserCommandHandler _handler;

    public RegisterUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();

        _handler = 
            new RegisterUserCommandHandler(_userRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var email = "test@example.com";

        var command = new RegisterUserCommand(email, "abc123");

        _userRepositoryMock
            .Setup(o => o.GetByEmailAsync(email))
            .ReturnsAsync((User?)null);        

        var handler = await _handler.HandleAsync(command);

        Assert.Equal(email, handler.Email);
    }

    [Fact]
    public async Task DuplicateEmail()
    {    
        _userRepositoryMock
            .Setup(o => o.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(User.Create("test@example.com", "hashedpassword"));

        var command = new RegisterUserCommand("test@example.com", "hashedpassword");

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}