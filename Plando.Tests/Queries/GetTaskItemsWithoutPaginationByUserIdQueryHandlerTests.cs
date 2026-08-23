using Microsoft.AspNetCore.Identity;
using Moq;
using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Application.Queries.TaskItems;
using Plando.Domain.Entities;

namespace Plando.Tests.Queries;

public class GetTaskItemsWithoutPaginationByUserIdQueryHandlerTests
{
    private readonly Mock<ITaskItemRepository> _taskItemRepositoryMock;
    private readonly 
        GetTaskItemsWithoutPaginationByUserIdQueryHandler _handler;

    public GetTaskItemsWithoutPaginationByUserIdQueryHandlerTests()
    {
        _taskItemRepositoryMock = new Mock<ITaskItemRepository>();

        _handler =
            new GetTaskItemsWithoutPaginationByUserIdQueryHandler(
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
            .Setup(s => s.GetAllByUserIdAsync(user.Id))
            .ReturnsAsync(taskItemsList);

        var query = new GetTaskItemsWithoutPaginationByUserIdQuery(user.Id);

        var result = await _handler.HandleAsync(query);

        Assert.Equal(taskItemDTOsList.Count, result.Count());
        Assert.Equal(taskItemDTOsList.Select(t => t.Title), result.Select(t => t.Title));
        Assert.Equal(taskItemDTOsList
            .Select(t => t.Description), result.Select(t => t.Description));
    }

    [Fact]
    public async Task ReturnsEmptyList()
    {
        _taskItemRepositoryMock
            .Setup(s => s.GetAllByUserIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new List<TaskItem>());

        var query = new GetTaskItemsWithoutPaginationByUserIdQuery(Guid.NewGuid());

        var result = await _handler.HandleAsync(query);

        Assert.Empty(result);
    }
}