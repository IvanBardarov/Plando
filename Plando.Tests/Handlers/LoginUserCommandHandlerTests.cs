using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.Users;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class LoginUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IJwtTokenService> _jwtTokenServiceMock;
    private readonly LoginUserCommandHandler _handler;

    public LoginUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _jwtTokenServiceMock = new Mock<IJwtTokenService>();

        _handler = new LoginUserCommandHandler(
            _userRepositoryMock.Object,
            _jwtTokenServiceMock.Object);
    }


    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");

        _userRepositoryMock
            .Setup(o => o.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(User.Create("test@example.com", realHash));

        _jwtTokenServiceMock
            .Setup(s => s.GenerateToken(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        var command = new LoginUserCommand("test@example.com", "abc123");

        var result = await _handler.HandleAsync(command);

        Assert.Equal("fake-jwt-token", result);
    }

    [Fact]
    public async Task UserNotFound()
    {
        var command = new LoginUserCommand("test@example.com", "hashedpassword");

        _userRepositoryMock
            .Setup(o => o.GetByEmailAsync("test@example.com"))
            .ReturnsAsync((User?)null);

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }

    [Fact]
    public async Task WrongPassword()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");

        _userRepositoryMock
            .Setup(o => o.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(User.Create("test@example.com", realHash));

        var command = new LoginUserCommand("test@example.com", "wrongpassword");

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}