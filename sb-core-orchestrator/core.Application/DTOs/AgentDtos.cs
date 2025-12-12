namespace core.Application.DTOs;

/// <summary>
/// Response from agent with list of installed packages.
/// </summary>
public class PackageListResponse
{
    public string AgentId { get; set; } = string.Empty;
    public string Distro { get; set; } = string.Empty;
    public List<PackageInfo> Packages { get; set; } = new();
}

/// <summary>
/// Information about an installed package.
/// </summary>
public class PackageInfo
{
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
}

/// <summary>
/// DTOs for agent communication.
/// </summary>
public static class AgentDtos
{
    /// <summary>
    /// Command to be executed on the agent.
    /// </summary>
    public class Command
    {
        public string Action { get; set; } = string.Empty;
        public Dictionary<string, object> Params { get; set; } = new();
    }
    
    /// <summary>
    /// Response from command execution.
    /// </summary>
    public class CommandResponse
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public object? Details { get; set; }
    }
}