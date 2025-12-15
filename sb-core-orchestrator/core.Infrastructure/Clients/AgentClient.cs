namespace core.Infrastructure.Clients;

using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using core.Application.Interfaces;
using core.Application.DTOs;

/// <summary>
/// HTTP client for communicating with Python agents on endpoints.
/// </summary>
public class AgentClient : IAgentClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AgentClient> _logger;

    public AgentClient(HttpClient httpClient, IConfiguration configuration, ILogger<AgentClient> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<PackageListResponse> GetPackagesAsync(string endpointId, string scanType)
    {
        var agentBaseUrl = _configuration["Services:AgentBaseUrlTemplate"]?.Replace("{0}", endpointId);
        
        if (string.IsNullOrEmpty(agentBaseUrl))
            throw new ArgumentException($"Agent base URL not configured for endpoint {endpointId}");
        
        _httpClient.BaseAddress = new Uri(agentBaseUrl);
        
        var response = await _httpClient.GetAsync($"agent/packages?type={scanType}");
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<PackageListResponse>();
        return result ?? new PackageListResponse();
    }

    public async Task<AgentDtos.CommandResponse> ExecuteCommandAsync(string endpointId, AgentDtos.Command command)
    {
        var agentBaseUrl = _configuration["Services:AgentBaseUrlTemplate"]?.Replace("{0}", endpointId);
        
        if (string.IsNullOrEmpty(agentBaseUrl))
            throw new ArgumentException($"Agent base URL not configured for endpoint {endpointId}");
        
        _httpClient.BaseAddress = new Uri(agentBaseUrl);
        
        var response = await _httpClient.PostAsJsonAsync("agent/commands", command);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<AgentDtos.CommandResponse>();
        return result ?? new AgentDtos.CommandResponse { Success = false, ErrorMessage = "Invalid response from agent" };
    }
}
