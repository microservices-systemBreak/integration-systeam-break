namespace core.Domain.Entities;

/// <summary>
/// Represents the current state and status of a monitored endpoint.
/// Tracks online status, last scan time, and overall security severity.
/// </summary>
public class EndpointState
{
    public string EndpointId { get; private set; }
    public bool Online { get; private set; }
    public DateTime? LastSeenAt { get; private set; }
    public DateTime? LastScanAt { get; private set; }
    public string LastOverallSeverity { get; private set; }

    // Private constructor for EF Core
    private EndpointState() 
    {
        EndpointId = string.Empty;
        LastOverallSeverity = "NONE";
    }

    /// <summary>
    /// Creates a new endpoint state with the specified endpoint ID.
    /// </summary>
    /// <param name="endpointId">Unique identifier for the endpoint</param>
    public EndpointState(string endpointId)
    {
        EndpointId = endpointId;
        Online = false;
        LastOverallSeverity = "NONE";
    }

    /// <summary>
    /// Updates the scan result for this endpoint.
    /// </summary>
    /// <param name="scanTime">Time when the scan was completed</param>
    /// <param name="overallSeverity">Overall severity level from the scan</param>
    public void UpdateScanResult(DateTime scanTime, string overallSeverity)
    {
        LastScanAt = scanTime;
        LastOverallSeverity = overallSeverity;
        UpdateOnlineStatus(true, scanTime);
    }

    /// <summary>
    /// Updates the online status of the endpoint.
    /// </summary>
    /// <param name="online">Whether the endpoint is currently online</param>
    /// <param name="lastSeenAt">Optional timestamp of when endpoint was last seen</param>
    public void UpdateOnlineStatus(bool online, DateTime? lastSeenAt = null)
    {
        Online = online;
        if (lastSeenAt.HasValue)
            LastSeenAt = lastSeenAt.Value;
        else if (online)
            LastSeenAt = DateTime.UtcNow;
    }
}