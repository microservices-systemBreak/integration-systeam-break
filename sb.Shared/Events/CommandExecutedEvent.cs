namespace sb.Shared.Events;

/// <summary>
/// Event published when a remote command has been executed.
/// </summary>
public class CommandExecutedEvent
{
    public string JobId { get; set; } = string.Empty;
    public string EndpointId { get; set; } = string.Empty;
    public string CorrelationId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime ExecutedAt { get; set; }
    public object? Details { get; set; }
}
