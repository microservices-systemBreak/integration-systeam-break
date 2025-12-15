using Microsoft.EntityFrameworkCore;
using core.Application.Interfaces;
using core.Infrastructure.Data;
using core.Infrastructure.Clients;
using core.Infrastructure.MessageBus;
using core.Infrastructure.BackgroundServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<CoreDbContext>(options => options.UseNpgsql(connectionString));

// MediatR for CQRS pattern
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(core.Application.Commands.Scan.CreateScanCommand).Assembly));

// Repository implementations
builder.Services.AddScoped<IJobRepository, JobRepository>();
builder.Services.AddScoped<IEndpointStateRepository, EndpointStateRepository>();

// HTTP Clients for external services
builder.Services.AddHttpClient<IAgentClient, AgentClient>();
builder.Services.AddHttpClient<IVulnAnalyzerClient, VulnAnalyzerClient>();

// Event Publisher (RabbitMQ)
builder.Services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();

// Background Services
builder.Services.AddHostedService<ScanSchedulerService>();

// Health Checks
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString)
    .AddDbContextCheck<CoreDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline
<<<<<<< HEAD
// Configure the HTTP request pipeline
// Enable Swagger in all environments for testing purposes
app.UseSwagger();
app.UseSwaggerUI();
=======
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
>>>>>>> origin/feature/core-orchestrator

// Global Exception Handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"An unexpected error occurred.\"}");
    });
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
