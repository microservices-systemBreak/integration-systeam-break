using System.ComponentModel.DataAnnotations;

namespace vuln.Application.DTOs
{
    /// <summary>
    /// Request model for vulnerability analysis
    /// </summary>
    public class AnalysisRequest
    {
        /// <summary>
        /// Unique identifier of the agent providing the package list
        /// </summary>
        /// <example>agent-linux-01</example>
        [Required]
        public string AgentId { get; set; }

        /// <summary>
        /// List of packages to be analyzed
        /// </summary>
        [Required]
        public List<PackageInfoDto> Packages { get; set; } = new();
    }

    /// <summary>
    /// Information about a single package
    /// </summary>
    public class PackageInfoDto
    {
        /// <summary>
        /// Name of the package
        /// </summary>
        /// <example>openssl</example>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Version of the package
        /// </summary>
        /// <example>1.1.1f-1ubuntu2</example>
        [Required]
        public string Version { get; set; }
    }
}