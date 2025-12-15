namespace sb.Shared.Events;

/// <summary>
/// Event published when an error occurs in any microservice.
/// Consumed by sb-error-monitor for centralized error logging.
/// </summary>
public class ErrorEvent
{
    public string Service { get; set; } = string.Empty;
    public string CorrelationId { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Details { get; set; }
    public DateTime Timestamp { get; set; }
}
