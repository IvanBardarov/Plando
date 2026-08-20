using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class UpdateTaskItemCommandHandlerTests
{
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly Mock<ITaskListRepository> _taskListRepositoryMock;
    private readonly UpdateTaskItemCommandHandler _handler;

    public UpdateTaskItemCommandHandlerTests()
    {
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();
        _taskListRepositoryMock = new Mock<ITaskListRepository>();

        _handler = new UpdateTaskItemCommandHandler(
            _taskItemRepositoryMock.Object,
            _taskListRepositoryMock.Object);
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

        var now = DateTime.UtcNow;

        var taskItem = TaskItem.Create(
            "Title",
            "Description",
            now.AddDays(20),
            user,
            now.AddDays(10),
            false,
            false,
            taskList);

        _taskListRepositoryMock.Setup(o => o.GetByIdAsync(taskList.Id))
            .ReturnsAsync(taskList);

        _taskItemRepositoryMock.Setup(o => o.GetByIdAsync(taskItem.Id))
            .ReturnsAsync(taskItem);

        var command = new UpdateTaskItemCommand(
            taskItem.Id,
            taskItem.Title,
            taskItem.Description,
            taskItem.StartDate,
            taskItem.DueDate,
            taskList.Id,
            taskItem.CategoryId,
            taskItem.IsImportant,
            taskItem.IsUrgent);

        var result = await _handler.HandleAsync(command);

        Assert.Equal(taskItem.Title, result.Title);
    }

    [Fact]
    public async Task TaskItemNotFound()
    {
        _taskItemRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskItem?)null);

        var now = DateTime.UtcNow;

        var command = new UpdateTaskItemCommand(
            Guid.NewGuid(),
            "Tite",
            "Description",
            now.AddDays(20),
            now.AddDays(10),
            Guid.NewGuid(),
            Guid.NewGuid(),
            false,
            false);

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }

    [Fact]
    public async Task TaskListNotFound()
    {
        _taskListRepositoryMock.Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskList?)null);

        var now = DateTime.UtcNow;

        var command = new UpdateTaskItemCommand(
            Guid.NewGuid(),
            "Tite",
            "Description",
            now.AddDays(20),
            now.AddDays(10),
            Guid.NewGuid(),
            Guid.NewGuid(),
            false,
            false);

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}