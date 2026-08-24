using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Application.Queries.TaskItems;
using Plando.Domain.Entities;

namespace Plando.Tests.Queries;

public class GetTaskItemsByUserIdQueryHandlerTests
{
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly GetTaskItemsByUserIdQueryHandler _handler;

    public GetTaskItemsByUserIdQueryHandlerTests()
    {
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();

        _handler = new GetTaskItemsByUserIdQueryHandler(
            _taskItemRepositoryMock.Object);
    }

    [Fact]
    public async Task ReturnsAllTaskItems()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();
        var taskItemDTOsList = new List<TaskItemDto>();

        for (var i = 1; i < 4; i++)
        {
            var taskItem = TaskItem.Create(
                $"Title{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            var taskItemDto = TaskItemDto.FromEntity(taskItem);

            taskItemsList.Add(taskItem);
            taskItemDTOsList.Add(taskItemDto);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, null, null, null, null, null,
            null, null, null, null, null, null);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(taskItemDTOsList.Count, result.Items.Count());
        Assert.Equal(taskItemDTOsList.Select(t => t.Title),
            result.Items.Select(t => t.Title));
        Assert.Equal(taskItemDTOsList.Select(t => t.Description),
            result.Items.Select(t => t.Description));
    }

    [Fact]
    public async Task FilterByTitle()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();
        var taskItemDTOsList = new List<TaskItemDto>();

        for (var i = 1; i < 11; i++)
        {
            var prefix = (i % 2 == 0) ? "Title" : "Name";

            var taskItem = TaskItem.Create(
                $"{prefix}{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            var taskItemDto = TaskItemDto.FromEntity(taskItem);

            taskItemsList.Add(taskItem);

            if (taskItem.Title.Contains("Title"))
                taskItemDTOsList.Add(taskItemDto);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, "Title", null, null, null, null,
            null, null, null, null, null, null);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(taskItemDTOsList.Count, result.Items.Count());
        Assert.Equal(taskItemDTOsList.Select(t => t.Title),
            result.Items.Select(t => t.Title));
    }

    [Fact]
    public async Task FilterByIsCompleted()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();
        var taskItemDTOsList = new List<TaskItemDto>();

        for (var i = 1; i < 11; i++)
        {
            var taskItem = TaskItem.Create(
                $"Title{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            if (i % 2 == 0)
                taskItem.Complete();

            var taskItemDto = TaskItemDto.FromEntity(taskItem);

            taskItemsList.Add(taskItem);

            if (taskItem.IsCompleted)
                taskItemDTOsList.Add(taskItemDto);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, null, null, null, null, null,
            null, null, null, true, null, null);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(taskItemDTOsList.Count, result.Items.Count());
        Assert.Equal(taskItemDTOsList.Select(t => t.Title),
            result.Items.Select(t => t.Title));
        Assert.Equal(taskItemDTOsList.Select(t => t.IsCompleted),
            result.Items.Select(t => t.IsCompleted));
    }

    [Fact]
    public async Task ReturnsEmptyList()
    {
        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(It.IsAny<Guid>(), null, null))
            .ReturnsAsync(new List<TaskItem>());

        var query = new GetTaskItemsByUserIdQuery(
            Guid.NewGuid(), null, null, null, null, null, null,
            null, null, null, true, null, null);

        var result = await _handler.HandleAsync(query);

        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task ReturnsCorrectPage()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();
        var taskItemDTOsList = new List<TaskItemDto>();

        for (var i = 1; i < 16; i++)
        {
            var taskItem = TaskItem.Create(
                $"Title{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            var taskItemDto = TaskItemDto.FromEntity(taskItem);

            taskItemsList.Add(taskItem);

            if (i >= 6 && i <= 10)
                taskItemDTOsList.Add(taskItemDto);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, null, null, null, null, null,
            null, null, null, null, 2, 5);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(taskItemDTOsList.Count, result.Items.Count());
        Assert.Equal(taskItemDTOsList.Select(t => t.Title),
            result.Items.Select(t => t.Title));
        Assert.Equal(taskItemDTOsList.Select(t => t.Description),
            result.Items.Select(t => t.Description));
    }

    [Fact]
    public async Task ReturnsCorrectTotalCount()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();

        for (var i = 1; i < 16; i++)
        {
            var taskItem = TaskItem.Create(
                $"Title{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            taskItemsList.Add(taskItem);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, null, null, null, null, null,
            null, null, null, null, null, null);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(15, result.TotalCount);
    }

    [Fact]
    public async Task ReturnsCorrectTotalPages()
    {
        var passwordHasher = new PasswordHasher<string>();
        var realHash = passwordHasher.HashPassword("test@example.com", "abc123");
        var user = User.Create("test@example.com", realHash);

        var taskItemsList = new List<TaskItem>();

        for (var i = 1; i < 16; i++)
        {
            var taskItem = TaskItem.Create(
                $"Title{i}",
                $"Description{i}",
                DateTime.UtcNow,
                user,
                null,
                false,
                false);

            taskItemsList.Add(taskItem);
        }

        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(user.Id, null, null))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsByUserIdQuery(
            user.Id, null, null, null, null, null, null,
            null, null, null, null, null, 5);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(3, result.TotalPages);
    }
}