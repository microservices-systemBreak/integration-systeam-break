using System.Collections.Generic;

namespace core.Application.DTOs
{
    public class VulnerabilityAnalysis
    {
        public string OverallSeverity { get; set; } = "NONE";
        public List<Vulnerability> Vulnerabilities { get; set; } = new();
    }
    
    public class Vulnerability
    {
        public string PackageName { get; set; } = string.Empty;
        public string CurrentVersion { get; set; } = string.Empty;
        public string CveId { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal CvssScore { get; set; }
    }
}