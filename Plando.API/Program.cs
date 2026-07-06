using Microsoft.EntityFrameworkCore;
using Plando.API.Middleware;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Commands.TaskLists;
using Plando.Application.Commands.Users;
using Plando.Application.Interfaces;
using Plando.Application.Queries.TaskItems;
using Plando.Application.Queries.TaskLists;
using Plando.Application.Queries.Users;
using Plando.Infrastructure.Persistence;
using Plando.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

#region Services Pipeline

builder.Services.AddDbContext<PlandoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PlandoDb")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskListRepository, TaskListRepository>();

builder.Services.AddControllers();

// User handlers
builder.Services.AddScoped<RegisterUserCommandHandler>();
builder.Services.AddScoped<LoginUserCommandHandler>();
builder.Services.AddScoped<GetUserByIdQueryHandler>();

// TaskItem handlers
builder.Services.AddScoped<CreateTaskItemCommandHandler>();
builder.Services.AddScoped<CompleteTaskItemCommandHandler>();
builder.Services.AddScoped<DeleteTaskItemCommandHandler>();
builder.Services.AddScoped<GetTaskItemsByUserIdQueryHandler>();

// TaskList handlers
builder.Services.AddScoped<CreateTaskListCommandHandler>();
builder.Services.AddScoped<DeleteTaskListCommandHandler>();
builder.Services.AddScoped<GetTaskListsByUserIdQueryHandler>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<ExceptionHandlingMiddleware>();

#endregion

var app = builder.Build();

#region Middlewares Pipeline

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

#endregion

app.Run();