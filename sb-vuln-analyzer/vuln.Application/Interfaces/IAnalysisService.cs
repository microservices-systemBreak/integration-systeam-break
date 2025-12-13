using vuln.Application.DTOs;

namespace vuln.Application.Interfaces
{
    /// <summary>
    /// Defines the contract for the vulnerability analysis service
    /// </summary>
    public interface IAnalysisService
    {
        /// <summary>
        /// Analyzes a list of packages for vulnerabilities.
        /// </summary>
        /// <param name="request">The analysis request containing the packages.</param>
        /// <param name="correlationId">The correlation ID for tracing.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the vulnerability analysis.</returns>
        Task<VulnerabilityAnalysis> AnalyzePackagesAsync(AnalysisRequest request, string correlationId);
    }
}