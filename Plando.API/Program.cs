using Microsoft.EntityFrameworkCore;
using Plando.Application.Interfaces;
using Plando.Infrastructure.Persistence;
using Plando.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PlandoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PlandoDb")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskListRepository, TaskListRepository>();

var app = builder.Build();

app.Run();