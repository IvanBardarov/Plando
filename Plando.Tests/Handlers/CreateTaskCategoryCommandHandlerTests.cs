using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.Commands.TaskCategories;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Tests.Handlers;
public class CreateTaskCategoryCommandHandlerTests
{
    private readonly Mock<ITaskCategoryRepository> _taskCategoryRepositoryMock;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly CreateTaskCategoryCommandHandler _handler;

    public CreateTaskCategoryCommandHandlerTests()
    {
        _taskCategoryRepositoryMock = new Mock<ITaskCategoryRepository>();
        _userRepositoryMock = new Mock<IUserRepository>();

        _handler = new CreateTaskCategoryCommandHandler(
            _taskCategoryRepositoryMock.Object,
            _userRepositoryMock.Object);
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

        var command = new CreateTaskCategoryCommand(
            "Name",
            "Description",
            user.Id);

        var result = await _handler.HandleAsync(command);

        Assert.Equal("Name", result.Name);
    }

    [Fact]
    public async Task UserNotFound()
    {
        _userRepositoryMock
            .Setup(o => o.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var command = new CreateTaskCategoryCommand(
            "Name",
            "Description",
            Guid.NewGuid());

        await Assert.ThrowsAsync<DomainException>(() => _handler.HandleAsync(command));
    }
}