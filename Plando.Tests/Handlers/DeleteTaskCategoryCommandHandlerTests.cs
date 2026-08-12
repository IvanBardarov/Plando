using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskCategories;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;

public class DeleteTaskCategoryCommandHandlerTests
{
    private readonly Mock<ITaskCategoryRepository> _taskCategoryRepositoryMock;
    private readonly DeleteTaskCategoryCommandHandler _handler;

    public DeleteTaskCategoryCommandHandlerTests()
    {
        _taskCategoryRepositoryMock = new Mock<ITaskCategoryRepository>();

        _handler = new DeleteTaskCategoryCommandHandler(
            _taskCategoryRepositoryMock.Object);
    }

    [Fact]
    public async Task HappyPath()
    {
        var passwordHash = new PasswordHasher<string>();
        var realHash = passwordHash.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskCategory = TaskCategory.Create(
            "Name",
            "Description",
            user);

        _taskCategoryRepositoryMock
            .Setup(o => o.GetByIdAsync(taskCategory.Id))
            .ReturnsAsync(taskCategory);

        var command = new DeleteTaskCategoryCommand(taskCategory.Id);

        await _handler.HandleAsync(command);
    }

    [Fact]
    public async Task TaskCategoryNotFound()
    {
        _taskCategoryRepositoryMock
            .Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((TaskCategory?)null);

        var command = new DeleteTaskCategoryCommand(Guid.NewGuid());

        await Assert
            .ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}