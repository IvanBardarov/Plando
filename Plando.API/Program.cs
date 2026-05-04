using Microsoft.EntityFrameworkCore;
using Plando.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PlandoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PlandoDb")));

var app = builder.Build();

app.Run();