using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskLists;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class CreateTaskListCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITaskListRepository> _taskListRepositoryMock;
    private readonly CreateTaskListCommandHandler _handler;

    public CreateTaskListCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _taskListRepositoryMock = new Mock<ITaskListRepository>();

        _handler = new CreateTaskListCommandHandler(
            _taskListRepositoryMock.Object,
            _userRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        _userRepositoryMock
            .Setup(s => s.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        var command = new CreateTaskListCommand(
            "My Task List",
            user.Id);

        var result = await _handler.HandleAsync(command);

        Assert.Equal("My Task List", result.Name);
    }

    [Fact]
    public async Task UserNotFound()
    {
        _userRepositoryMock
            .Setup(s => s.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var command = new CreateTaskListCommand(
            "My Task List",
            Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}
