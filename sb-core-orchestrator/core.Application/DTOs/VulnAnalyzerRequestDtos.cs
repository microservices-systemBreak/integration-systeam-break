using System.Collections.Generic;
using System.Linq;

namespace core.Application.DTOs
{
    public class AnalysisRequest
    {
        public string AgentId { get; set; } = string.Empty;
        public List<PackageInfoDto> Packages { get; set; } = new();
    }
    
    public class PackageInfoDto
    {
        public string Name { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
    }
}