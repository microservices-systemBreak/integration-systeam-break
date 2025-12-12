namespace vuln.Application.Services;

using Microsoft.Extensions.Logging;
using vuln.Application.DTOs;
using vuln.Application.Interfaces;
using vuln.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/// <summary>
/// Service for performing vulnerability analysis on packages.
/// </summary>
public class AnalysisService : IAnalysisService
{
    private readonly ICveEntryRepository _cveEntryRepository;
    private readonly ILogger<AnalysisService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="AnalysisService"/> class.
    /// </summary>
    /// <param name="cveEntryRepository">The CVE entry repository.</param>
    /// <param name="logger">The logger instance.</param>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="cveEntryRepository"/> or <paramref name="logger"/> is null.</exception>
    public AnalysisService(ICveEntryRepository cveEntryRepository, ILogger<AnalysisService> logger)
    {
        _cveEntryRepository = cveEntryRepository ?? throw new ArgumentNullException(nameof(cveEntryRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Analyzes a list of packages for vulnerabilities.
    /// </summary>
    /// <param name="request">Analysis request containing package information</param>
    /// <param name="correlationId">Correlation ID for distributed tracing</param>
    /// <returns>Vulnerability analysis result</returns>
    public async Task<VulnerabilityAnalysis> AnalyzePackagesAsync(AnalysisRequest request, string correlationId)
    {
        // Validate that the request contains packages to analyze
        if (request?.Packages == null || !request.Packages.Any())
        {
            _logger.LogWarning("Analysis request received with no packages for correlation {CorrelationId}", correlationId);
            return new VulnerabilityAnalysis();
        }

        _logger.LogInformation("Starting vulnerability analysis for {PackageCount} packages with correlation {CorrelationId}", 
            request.Packages.Count, correlationId);

        var analysis = new VulnerabilityAnalysis();
        var packageNames = request.Packages.Select(p => p.Name).Distinct().ToList();

        // Use the repository to get potential vulnerabilities
        // Retrieve potential vulnerabilities from the repository based on package names
        var potentialVulnerabilities = await _cveEntryRepository.GetByPackageNamesAsync(packageNames);

        foreach (var package in request.Packages)
        {
            // Filter CVEs that match the package name and affect the installed version
            var vulnerabilities = potentialVulnerabilities
                .Where(cve => cve.PackageName == package.Name && IsVersionAffected(package.Version, cve.VulnerableVersionRange))
                .ToList();

            foreach (var cve in vulnerabilities)
            {
                analysis.Vulnerabilities.Add(new Vulnerability
                {
                    PackageName = package.Name,
                    InstalledVersion = package.Version,
                    CveId = cve.CveId,
                    Severity = cve.Severity,
                    CvssScore = cve.CvssScore,
                    Description = cve.Description,
                    VulnerableVersionRange = cve.VulnerableVersionRange
                });
            }
        }

        // Calculate the overall severity based on the highest severity vulnerability found
        analysis.OverallSeverity = CalculateOverallSeverity(analysis.Vulnerabilities);
        
        _logger.LogInformation("Completed vulnerability analysis for correlation {CorrelationId}. Found {VulnerabilityCount} vulnerabilities. Overall severity: {OverallSeverity}", 
            correlationId, analysis.Vulnerabilities.Count, analysis.OverallSeverity);

        return analysis;
    }

    /// <summary>
    /// Determines if a version is affected by a vulnerability based on version range.
    /// NOTE: This is a simplified implementation. For production use, integrate NuGet.Versioning or similar library.
    /// </summary>
    /// <param name="installedVersion">The installed version of the package</param>
    /// <param name="vulnerableRange">The vulnerable version range from CVE</param>
    /// <returns>True if version is affected</returns>
    private bool IsVersionAffected(string installedVersion, string vulnerableRange)
    {
        // Simplified version comparison
        // In a real system, you would use a proper version comparison library
        // Example vulnerable ranges: "<2.0", ">=1.0,<1.5", "1.2.3"
        
        if (string.IsNullOrWhiteSpace(vulnerableRange))
            return false;

        // Exact match
        if (vulnerableRange == installedVersion)
            return true;

        // Simple range parsing (very basic - production should use NuGet.Versioning)
        if (vulnerableRange.StartsWith("<"))
        {
            var maxVersion = vulnerableRange[1..].Trim();
            return string.CompareOrdinal(installedVersion, maxVersion) < 0;
        }

        if (vulnerableRange.StartsWith("<="))
        {
            var maxVersion = vulnerableRange[2..].Trim();
            return string.CompareOrdinal(installedVersion, maxVersion) <= 0;
        }

        return false;
    }

    /// <summary>
    /// Calculates overall severity based on the highest severity vulnerability found.
    /// </summary>
    /// <param name="vulnerabilities">List of vulnerabilities</param>
    /// <returns>Overall severity level</returns>
    private string CalculateOverallSeverity(List<Vulnerability> vulnerabilities)
    {
        if (!vulnerabilities.Any())
            return "NONE";

        var severityPriority = new Dictionary<string, int>
        {
            { "CRITICAL", 4 },
            { "HIGH", 3 },
            { "MEDIUM", 2 },
            { "LOW", 1 },
            { "NONE", 0 }
        };

        var highestSeverity = vulnerabilities
            .Select(v => v.Severity.ToUpperInvariant())
            .Select(s => severityPriority.ContainsKey(s) ? severityPriority[s] : 0)
            .Max();

        return severityPriority.FirstOrDefault(kv => kv.Value == highestSeverity).Key ?? "NONE";
    }
}