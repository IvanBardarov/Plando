using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Commands.Users;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class CreateTaskItemCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly Mock<ITaskListRepository> _taskListRepositoryMock;
    private readonly CreateTaskItemCommandHandler _handler;

    public CreateTaskItemCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();
        _taskListRepositoryMock = new Mock<ITaskListRepository>();

        _handler = new CreateTaskItemCommandHandler(
            _taskItemRepositoryMock.Object,
            _userRepositoryMock.Object,
            _taskListRepositoryMock.Object
            );
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        _userRepositoryMock
            .Setup(o => o.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        var command = new CreateTaskItemCommand(
            "Title",
            "Description",
            user.Id,
            DateTime.UtcNow.AddDays(1),
            null,
            null,
            null);

        var result = await _handler.HandleAsync(command);

        Assert.Equal("Title", result.Title);
    }

    [Fact]
    public async Task UserNotFound()
    {
        _userRepositoryMock
            .Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var command = new CreateTaskItemCommand(
            "Title",
            "Description",
            Guid.NewGuid(),
            DateTime.UtcNow.AddDays(1),
            null,
            null,
            null);

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}