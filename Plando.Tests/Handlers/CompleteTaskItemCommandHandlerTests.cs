using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class CompleteTaskItemCommandHandlerTests
{
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly CompleteTaskItemCommandHandler _handler;

    public CompleteTaskItemCommandHandlerTests()
    {
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();

        _handler = new CompleteTaskItemCommandHandler(_taskItemRepositoryMock.Object);
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
            DateTime.UtcNow,
            user,
            null,
            false,
            false);

        _taskItemRepositoryMock
            .Setup(s => s.GetByIdAsync(taskItem.Id))
            .ReturnsAsync(taskItem);

        var command = new CompleteTaskItemCommand(taskItem.Id);

        var result = await _handler.HandleAsync(command);

        Assert.True(result.IsCompleted);
    }

    [Fact]
    public async Task TaskItemNotFound()
    {
        _taskItemRepositoryMock
            .Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskItem?)null);

        var command = new CompleteTaskItemCommand(Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}