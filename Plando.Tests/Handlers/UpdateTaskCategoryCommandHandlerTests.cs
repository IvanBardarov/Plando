using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskCategories;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class UpdateTaskCategoryCommandHandlerTests
{
    private readonly Mock<ITaskCategoryRepository> _taskCategoryRepositoryMock;
    private readonly UpdateTaskCategoryCommandHandler _handler;

    public UpdateTaskCategoryCommandHandlerTests()
    {
        _taskCategoryRepositoryMock = new Mock<ITaskCategoryRepository>();

        _handler = new UpdateTaskCategoryCommandHandler(_taskCategoryRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHash = new PasswordHasher<string>();
        var realHash = passwordHash.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskCategory = TaskCategory.Create("Name", "Description", user);

        _taskCategoryRepositoryMock
            .Setup(o => o.GetByIdAsync(taskCategory.Id))
            .ReturnsAsync(taskCategory);

        var command = new UpdateTaskCategoryCommand(
            taskCategory.Id, 
            "Name", 
            "Description");

        var result = await _handler.HandleAsync(command);

        Assert.Equal("Name", result.Name);
    }

    [Fact]
    public async Task TaskCategoryNotFound()
    {
        _taskCategoryRepositoryMock
            .Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskCategory?)null);

        var command = new UpdateTaskCategoryCommand(
            Guid.NewGuid(),
            "Name",
            "Description");

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}