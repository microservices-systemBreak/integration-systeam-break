namespace core.Application.Commands.Scan;

using MediatR;
using Microsoft.Extensions.Logging;
using core.Application.DTOs;
using core.Application.Interfaces;
using core.Domain.Entities;
using sb.Shared.Events;

/// <summary>
/// Handler for creating and executing package scan jobs.
/// </summary>
public class CreateScanCommandHandler : IRequestHandler<CreateScanCommand, ScanResult>
{
    private readonly IAgentClient _agentClient;
    private readonly IVulnAnalyzerClient _vulnAnalyzerClient;
    private readonly IEventPublisher _eventPublisher;
    private readonly IJobRepository _jobRepository;
    private readonly IEndpointStateRepository _endpointStateRepository;
    private readonly ILogger<CreateScanCommandHandler> _logger;

    public CreateScanCommandHandler(
        IAgentClient agentClient,
        IVulnAnalyzerClient vulnAnalyzerClient,
        IEventPublisher eventPublisher,
        IJobRepository jobRepository,
        IEndpointStateRepository endpointStateRepository,
        ILogger<CreateScanCommandHandler> logger)
    {
        _agentClient = agentClient;
        _vulnAnalyzerClient = vulnAnalyzerClient;
        _eventPublisher = eventPublisher;
        _jobRepository = jobRepository;
        _endpointStateRepository = endpointStateRepository;
        _logger = logger;
    }

    public async Task<ScanResult> Handle(CreateScanCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var correlationId = command.CorrelationId;
        var jobId = $"SCAN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}"[..18];
        
        var job = new Job(jobId, "SCAN_PACKAGES", request.EndpointId, correlationId);
        
        await _jobRepository.AddAsync(job);
        
        try
        {
            var packages = await _agentClient.GetPackagesAsync(request.EndpointId, request.ScanType);
            var analysis = await _vulnAnalyzerClient.AnalyzePackagesAsync(packages);
            
            var endpointState = await _endpointStateRepository.GetByIdAsync(request.EndpointId);
            
            if (endpointState == null)
            {
                endpointState = new EndpointState(request.EndpointId);
                await _endpointStateRepository.AddAsync(endpointState);
            }
            
            endpointState.UpdateScanResult(DateTime.UtcNow, analysis.OverallSeverity);
            await _endpointStateRepository.UpdateAsync(endpointState);
            
            job.MarkAsSuccess();
            await _jobRepository.UpdateAsync(job);
            
            await _eventPublisher.PublishScanCompletedAsync(new ScanCompletedEvent
            {
                JobId = jobId,
                EndpointId = request.EndpointId,
                CorrelationId = correlationId,
                CompletedAt = DateTime.UtcNow,
                Result = new ScanResultData
                {
                    OverallSeverity = analysis.OverallSeverity,
                    VulnerabilitiesFound = analysis.Vulnerabilities?.Count ?? 0,
                    PackagesAnalyzed = packages.Packages?.Count ?? 0
                }
            });
            
            return new ScanResult { JobId = jobId, CorrelationId = correlationId, Status = job.Status };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Scan failed for {EndpointId} with correlation {CorrelationId}", 
                request.EndpointId, correlationId);
            
            job.MarkAsFailed(ex.Message);
            await _jobRepository.UpdateAsync(job);
            
            await _eventPublisher.PublishErrorAsync(new ErrorEvent
            {
                Service = "sb-core-orchestrator",
                CorrelationId = correlationId,
                Level = "ERROR",
                Message = $"Scan failed for {request.EndpointId}: {ex.Message}",
                Timestamp = DateTime.UtcNow,
                Details = new { EndpointId = request.EndpointId, Error = ex.Message }
            });
            
            return new ScanResult { JobId = jobId, CorrelationId = correlationId, Status = job.Status };
        }
    }
}
