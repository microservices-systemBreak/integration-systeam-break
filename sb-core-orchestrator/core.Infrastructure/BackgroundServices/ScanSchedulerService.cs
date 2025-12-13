namespace core.Infrastructure.BackgroundServices;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MediatR;
using core.Application.Commands.Scan;
using core.Application.DTOs;
using core.Infrastructure.Data;

/// <summary>
/// Background service that periodically triggers package scans for registered endpoints.
/// </summary>
public class ScanSchedulerService : BackgroundService
{
    private readonly ILogger<ScanSchedulerService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _configuration;

    public ScanSchedulerService(
        ILogger<ScanSchedulerService> logger, 
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Scan Scheduler Service is starting");

        // Read interval from configuration
        var intervalSeconds = _configuration.GetValue<int>("Scheduler:IntervalSeconds", 300);
        var interval = TimeSpan.FromSeconds(intervalSeconds);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
                var dbContext = scope.ServiceProvider.GetRequiredService<CoreDbContext>();

                // Get all known endpoints from database
                var endpoints = await dbContext.EndpointsState
                    .Select(e => e.EndpointId)
                    .ToListAsync(stoppingToken);

                _logger.LogInformation("Triggering scheduled scans for {Count} endpoints", endpoints.Count);

                foreach (var endpointId in endpoints)
                {
                    try
                    {
                        var correlationId = $"SCHED-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..30];
                        var scanRequest = new ScanRequest 
                        { 
                            EndpointId = endpointId, 
                            ScanType = "PACKAGES_LIGHT", 
                            RequestedBy = "Scheduler" 
                        };
                        
                        var command = new CreateScanCommand(scanRequest, correlationId);
                        await mediator.Send(command, stoppingToken);
                        
                        _logger.LogInformation("Scheduled scan triggered for endpoint {EndpointId}", endpointId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to trigger scan for endpoint {EndpointId}", endpointId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in the Scan Scheduler Service");
            }

            _logger.LogInformation("Next scheduled scan in {Interval} seconds", intervalSeconds);
            await Task.Delay(interval, stoppingToken);
        }

        _logger.LogInformation("Scan Scheduler Service is stopping");
    }
}
