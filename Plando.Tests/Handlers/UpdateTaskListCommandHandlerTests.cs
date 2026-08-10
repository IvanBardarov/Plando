using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskLists;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;


namespace Plando.Tests.Handlers;
public class UpdateTaskListCommandHandlerTests
{
    private readonly Mock<ITaskListRepository> _taskListRepositoryMock;
    private readonly UpdateTaskListCommandHandler _handler;

    public UpdateTaskListCommandHandlerTests()
    {
        _taskListRepositoryMock = new Mock<ITaskListRepository>();
        _handler =
            new UpdateTaskListCommandHandler(_taskListRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskList = TaskList.Create(
            "List 55",
            user);

        _taskListRepositoryMock.Setup(o => o.GetByIdAsync(taskList.Id))
            .ReturnsAsync(taskList);

        var command = new UpdateTaskListCommand(
            taskList.Id,
            taskList.Name);

        var result = await _handler.HandleAsync(command);

        Assert.Equal(taskList.Name, result.Name);
    }

    [Fact]
    public async Task TaskListNotFound()
    {
        _taskListRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskList?)null);

        var command = new UpdateTaskListCommand(
            Guid.NewGuid(),
            "List 55");

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}