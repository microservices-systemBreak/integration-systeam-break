namespace sb.Shared.Events;

/// <summary>
/// Event published when a package scan has been completed successfully.
/// </summary>
public class ScanCompletedEvent
{
    public string JobId { get; set; } = string.Empty;
    public string EndpointId { get; set; } = string.Empty;
    public string CorrelationId { get; set; } = string.Empty;
    public DateTime CompletedAt { get; set; }
    public ScanResultData Result { get; set; } = new();
}

public class ScanResultData
{
    public string OverallSeverity { get; set; } = "NONE";
    public int VulnerabilitiesFound { get; set; }
    public int PackagesAnalyzed { get; set; }
}
