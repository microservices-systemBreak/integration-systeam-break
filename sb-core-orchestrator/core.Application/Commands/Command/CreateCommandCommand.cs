using MediatR;
using core.Application.DTOs;

namespace core.Application.Commands.Command;

/// <summary>
/// Command to create and execute a remote command job.
/// </summary>
/// <param name="Request">Command request details</param>
/// <param name="CorrelationId">Correlation ID for distributed tracing</param>
public record CreateCommandCommand(CommandRequest Request, string CorrelationId) : IRequest<CommandResult>;
