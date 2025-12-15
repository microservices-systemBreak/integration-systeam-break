using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using core.Application.Interfaces;
using core.Application.DTOs;

namespace core.Infrastructure.Clients
{
    public class VulnAnalyzerClient : IVulnAnalyzerClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<VulnAnalyzerClient> _logger;

        public VulnAnalyzerClient(HttpClient httpClient, IConfiguration configuration, ILogger<VulnAnalyzerClient> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<VulnerabilityAnalysis> AnalyzePackagesAsync(PackageListResponse packages)
        {
            var vulnAnalyzerUrl = _configuration["Services:VulnAnalyzer"];
            
            if (string.IsNullOrEmpty(vulnAnalyzerUrl))
                throw new ArgumentException("Vulnerability analyzer URL not configured");
            
            _httpClient.BaseAddress = new Uri(vulnAnalyzerUrl);
            
            var request = new AnalysisRequest
            {
                AgentId = packages.AgentId,
                Packages = packages.Packages.Select(p => new PackageInfoDto
                {
                    Name = p.Name,
                    Version = p.Version
                }).ToList()
            };
            
            var response = await _httpClient.PostAsJsonAsync("analyze/packages", request);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<VulnerabilityAnalysis>();
            return result ?? new VulnerabilityAnalysis();
        }
    }
}