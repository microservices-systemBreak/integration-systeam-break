using MediatR;
using core.Application.DTOs;

namespace core.Application.Commands.Scan;

/// <summary>
/// Command to create and execute a package scan job.
/// </summary>
/// <param name="Request">Scan request details</param>
/// <param name="CorrelationId">Correlation ID for distributed tracing</param>
public record CreateScanCommand(ScanRequest Request, string CorrelationId) : IRequest<ScanResult>;
