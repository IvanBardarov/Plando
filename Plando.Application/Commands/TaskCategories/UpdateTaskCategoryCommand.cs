namespace Plando.Application.Commands.TaskCategories;

public record UpdateTaskCategoryCommand(
    Guid Id,
    string Name, 
    string Description);