using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.TaskLists;

public class GetTaskListByIdQueryHandler
{
    private readonly ITaskListRepository _taskListRepository;

    public GetTaskListByIdQueryHandler(ITaskListRepository taskListRepository)
    {
        _taskListRepository = taskListRepository;
    }

    public async Task<TaskListDto> HandleAsync(GetTaskListByIdQuery query)
    {
        var taskList = await _taskListRepository.GetByIdAsync(query.Id);
        if (taskList is null)
            throw new DomainException($"There is no such a task list with id: {query.Id}!");

        return TaskListDto.FromEntity(taskList);
    }
}