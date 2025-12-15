using MediatR;
using Microsoft.Extensions.Logging;
using core.Application.DTOs;
using core.Application.Interfaces;
using core.Domain.Entities;
using sb.Shared.Events;

namespace core.Application.Commands.Command;

/// <summary>
/// Handler for executing remote commands on endpoints.
/// </summary>
public class CreateCommandCommandHandler : IRequestHandler<CreateCommandCommand, CommandResult>
{
    private readonly IAgentClient _agentClient;
    private readonly IEventPublisher _eventPublisher;
    private readonly IJobRepository _jobRepository;
    private readonly ILogger<CreateCommandCommandHandler> _logger;

    public CreateCommandCommandHandler(
        IAgentClient agentClient,
        IEventPublisher eventPublisher,
        IJobRepository jobRepository,
        ILogger<CreateCommandCommandHandler> logger)
    {
        _agentClient = agentClient;
        _eventPublisher = eventPublisher;
        _jobRepository = jobRepository;
        _logger = logger;
    }

    public async Task<CommandResult> Handle(CreateCommandCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;
        var correlationId = command.CorrelationId;
        var jobId = $"CMD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}"[..18];
        
        var job = new Job(jobId, "COMMAND", request.EndpointId, correlationId, request.Action);
        
        await _jobRepository.AddAsync(job);
        
        try
        {
            var agentCommand = new AgentDtos.Command
            {
                Action = request.Action,
                Params = request.Params
            };
            
            var response = await _agentClient.ExecuteCommandAsync(request.EndpointId, agentCommand);
            
            if (response.Success)
            {
                job.MarkAsSuccess();
            }
            else
            {
                job.MarkAsFailed(response.ErrorMessage ?? "Unknown error");
            }
            
            await _eventPublisher.PublishCommandExecutedAsync(new CommandExecutedEvent
            {
                JobId = jobId,
                EndpointId = request.EndpointId,
                CorrelationId = correlationId,
                Action = request.Action,
                Status = job.Status,
                ExecutedAt = DateTime.UtcNow,
                Details = response.Details
            });
            
            await _jobRepository.UpdateAsync(job);
            
            return new CommandResult 
            { 
                JobId = jobId, 
                CorrelationId = correlationId, 
                Status = job.Status 
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Command {Action} failed for {EndpointId} with correlation {CorrelationId}", 
                request.Action, request.EndpointId, correlationId);
            
            job.MarkAsFailed(ex.Message);
            
            await _eventPublisher.PublishErrorAsync(new ErrorEvent
            {
                Service = "sb-core-orchestrator",
                CorrelationId = correlationId,
                Level = "ERROR",
                Message = $"Command {request.Action} failed for {request.EndpointId}: {ex.Message}",
                Timestamp = DateTime.UtcNow,
                Details = new { EndpointId = request.EndpointId, Action = request.Action, Error = ex.Message }
            });
            
            await _jobRepository.UpdateAsync(job);
            
            return new CommandResult { JobId = jobId, CorrelationId = correlationId, Status = job.Status };
        }
    }
}
