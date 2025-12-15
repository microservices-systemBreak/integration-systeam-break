namespace core.Application.Interfaces;

using core.Application.DTOs;

/// <summary>
/// Interface for communicating with Python agents on endpoints.
/// </summary>
public interface IAgentClient
{
    Task<PackageListResponse> GetPackagesAsync(string endpointId, string scanType);
    Task<AgentDtos.CommandResponse> ExecuteCommandAsync(string endpointId, AgentDtos.Command command);
}
