namespace Plando.Application.Commands.TaskCategories;

public record CreateTaskCategoryCommand(
    string Name, 
    string Description, 
    Guid UserId);