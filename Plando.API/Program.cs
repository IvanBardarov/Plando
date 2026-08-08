using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Plando.API.Middleware;
using Plando.Application.Commands.Notes;
using Plando.Application.Commands.TaskItems;
using Plando.Application.Commands.TaskLists;
using Plando.Application.Commands.Users;
using Plando.Application.Interfaces;
using Plando.Application.Queries.Notes;
using Plando.Application.Queries.TaskItems;
using Plando.Application.Queries.TaskLists;
using Plando.Application.Queries.Users;
using Plando.Infrastructure.Persistence;
using Plando.Infrastructure.Repositories;
using Plando.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Services Pipeline

builder.Services.AddDbContext<PlandoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PlandoDb")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskListRepository, TaskListRepository>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services.AddControllers();

// User handlers
builder.Services.AddScoped<RegisterUserCommandHandler>();
builder.Services.AddScoped<LoginUserCommandHandler>();
builder.Services.AddScoped<GetUserByIdQueryHandler>();

// TaskItem handlers
builder.Services.AddScoped<CreateTaskItemCommandHandler>();
builder.Services.AddScoped<UpdateTaskItemCommandHandler>();
builder.Services.AddScoped<CompleteTaskItemCommandHandler>();
builder.Services.AddScoped<DeleteTaskItemCommandHandler>();
builder.Services.AddScoped<GetTaskItemsByUserIdQueryHandler>();
builder.Services.AddScoped<GetTaskItemByIdQueryHandler>();

// TaskList handlers
builder.Services.AddScoped<CreateTaskListCommandHandler>();
builder.Services.AddScoped<UpdateTaskListCommandHandler>();
builder.Services.AddScoped<DeleteTaskListCommandHandler>();
builder.Services.AddScoped<GetTaskListsByUserIdQueryHandler>();
builder.Services.AddScoped<GetTaskListByIdQueryHandler>();

// Note handlers
builder.Services.AddScoped<CreateNoteCommandHandler>();
builder.Services.AddScoped<UpdateNoteCommandHandler>();
builder.Services.AddScoped<DeleteNoteCommandHandler>();
builder.Services.AddScoped<GetNoteByIdQueryHandler>();
builder.Services.AddScoped<GetNotesByTaskItemIdQueryHandler>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddTransient<ExceptionHandlingMiddleware>();

// Jwt Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!))
        };
    });

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("PlandoPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React default port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

#endregion

var app = builder.Build();

#region Middlewares Pipeline

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseCors("PlandoPolicy");
app.UseAuthorization();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

#endregion

app.Run();