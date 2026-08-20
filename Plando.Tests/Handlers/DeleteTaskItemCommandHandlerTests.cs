using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class DeleteTaskItemCommandHandlerTests
{
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly DeleteTaskItemCommandHandler _handler;

    public DeleteTaskItemCommandHandlerTests()
    {
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();

        _handler = new DeleteTaskItemCommandHandler(_taskItemRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var email = "test@example.com";
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword(email, "abc123");

        var user = User.Create(email, realHash);

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

        var command = new DeleteTaskItemCommand(taskItem.Id);

        await _handler.HandleAsync(command);
    }

    [Fact]
    public async Task TaskItemNotFound()
    {
        _taskItemRepositoryMock
            .Setup(s => s.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskItem?)null);

        var command = new DeleteTaskItemCommand(Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}