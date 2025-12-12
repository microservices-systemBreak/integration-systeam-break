using MediatR;
using Microsoft.Extensions.Logging;
using core.Application.DTOs;
using core.Application.Interfaces;

namespace core.Application.Queries.GetEndpointStatus;

/// <summary>
/// Handler for retrieving endpoint status information.
/// </summary>
public class GetEndpointStatusQueryHandler : IRequestHandler<GetEndpointStatusQuery, EndpointStatusDto?>
{
    private readonly IEndpointStateRepository _endpointStateRepository;
    private readonly ILogger<GetEndpointStatusQueryHandler> _logger;

    public GetEndpointStatusQueryHandler(
        IEndpointStateRepository endpointStateRepository,
        ILogger<GetEndpointStatusQueryHandler> logger)
    {
        _endpointStateRepository = endpointStateRepository;
        _logger = logger;
    }

    public async Task<EndpointStatusDto?> Handle(GetEndpointStatusQuery query, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving status for endpoint {EndpointId}", query.EndpointId);

        var endpointState = await _endpointStateRepository.GetByIdAsync(query.EndpointId);

        if (endpointState == null)
        {
            _logger.LogWarning("Endpoint {EndpointId} not found", query.EndpointId);
            return null;
        }

        return new EndpointStatusDto
        {
            EndpointId = endpointState.EndpointId,
            Online = endpointState.Online,
            LastSeenAt = endpointState.LastSeenAt,
            LastScanAt = endpointState.LastScanAt,
            OverallSeverity = endpointState.LastOverallSeverity
        };
    }
}
