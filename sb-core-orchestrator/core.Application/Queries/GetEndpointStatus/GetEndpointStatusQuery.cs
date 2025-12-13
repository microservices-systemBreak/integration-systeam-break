using MediatR;
using core.Application.DTOs;

namespace core.Application.Queries.GetEndpointStatus;

/// <summary>
/// Query to retrieve the current status of a specific endpoint.
/// </summary>
/// <param name="EndpointId">Unique identifier of the endpoint</param>
public record GetEndpointStatusQuery(string EndpointId) : IRequest<EndpointStatusDto?>;
