using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskLists;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Enums;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class DeleteTaskListCommandHandlerTests
{
    private readonly Mock<ITaskListRepository> _taskListRepositoryMock;
    private readonly DeleteTaskListCommandHandler _handler;

    public DeleteTaskListCommandHandlerTests()
    {
        _taskListRepositoryMock = new Mock<ITaskListRepository>();

        _handler = new DeleteTaskListCommandHandler(_taskListRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskList = TaskList.Create(
            "My Task List",
            TaskListColor.Gray,
            user
            );

        _taskListRepositoryMock
            .Setup(s => s.GetByIdAsync(taskList.Id))
            .ReturnsAsync(taskList);

        var command = new DeleteTaskListCommand(taskList.Id);

        await _handler.HandleAsync(command);
    }

    [Fact]
    public async Task TaskListNotFound()
    {
        _taskListRepositoryMock
            .Setup(s => s.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskList?)null);

        var command = new DeleteTaskListCommand(Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}