using core.Application.DTOs;
using System.Threading.Tasks;

namespace core.Application.Interfaces
{
    public interface IVulnAnalyzerClient
    {
        Task<VulnerabilityAnalysis> AnalyzePackagesAsync(PackageListResponse packages);
    }
}