using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.Notes;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class CreateNoteCommandHandlerTests
{
    private readonly Mock<INoteRepository> _noteRepositoryMock;
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly CreateNoteCommandHandler _handler;

    public CreateNoteCommandHandlerTests()
    {
        _noteRepositoryMock = new Mock<INoteRepository>();
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();

        _handler = new CreateNoteCommandHandler(
            _noteRepositoryMock.Object,
            _taskItemRepositoryMock.Object,
            _userRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItem = TaskItem.Create(
            "Title",
            "Description",
            new DateTime(2026, 1, 1),
            user,
            null,
            null);

        _userRepositoryMock.Setup(o => o.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        _taskItemRepositoryMock.Setup(o => o.GetByIdAsync(taskItem.Id))
            .ReturnsAsync(taskItem);

        var command = new CreateNoteCommand("Note content", taskItem.Id, user.Id);

        var result = await _handler.HandleAsync(command);

        Assert.Equal("Note content", result.Content);
    }

    [Fact]
    public async Task UserNotFound()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItem = TaskItem.Create(
            "Title",
            "Description",
            new DateTime(2026, 1, 1),
            user,
            null,
            null
        );

        _taskItemRepositoryMock.Setup(o => o.GetByIdAsync(taskItem.Id))
            .ReturnsAsync(taskItem);

        _userRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var command = new CreateNoteCommand(
            "Note content",
            taskItem.Id,
            Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }

    [Fact]
    public async Task TaskItemNotFound()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItem = TaskItem.Create(
            "Title",
            "Description",
            new DateTime(2026, 1, 1),
            user,
            null,
            null
        );

        _taskItemRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskItem?)null);

        _userRepositoryMock.Setup(o => o.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        var command = new CreateNoteCommand(
            "Note content",
            Guid.NewGuid(),
            user.Id);

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}