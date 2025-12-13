namespace core.Domain.Entities;

/// <summary>
/// Represents a job that orchestrates package scans or remote command executions.
/// Implements a Rich Domain Model with protected state transitions.
/// </summary>
public class Job
{
    public string JobId { get; private set; }
    public string Type { get; private set; }
    public string EndpointId { get; private set; }
    public string? Action { get; private set; }
    public string Status { get; private set; }
    public string CorrelationId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime? ScheduledAt { get; private set; }
    public string? ScheduleType { get; private set; }

    // Private constructor for EF Core
    private Job() 
    {
        JobId = string.Empty;
        Type = string.Empty;
        EndpointId = string.Empty;
        Status = "PENDING";
        CorrelationId = string.Empty;
    }

    /// <summary>
    /// Creates a new job with the specified parameters.
    /// </summary>
    /// <param name="jobId">Unique identifier for the job</param>
    /// <param name="type">Type of job (SCAN_PACKAGES or COMMAND)</param>
    /// <param name="endpointId">Target endpoint identifier</param>
    /// <param name="correlationId">Correlation ID for distributed tracing</param>
    /// <param name="action">Command action (only for COMMAND type)</param>
    /// <param name="scheduleType">Type of schedule (MANUAL or CRON)</param>
    /// <param name="scheduledAt">Scheduled execution time</param>
    public Job(string jobId, string type, string endpointId, string correlationId, string? action = null, string? scheduleType = null, DateTime? scheduledAt = null)
    {
        JobId = jobId;
        Type = type;
        EndpointId = endpointId;
        CorrelationId = correlationId;
        Action = action;
        Status = "PENDING";
        CreatedAt = DateTime.UtcNow;
        ScheduleType = scheduleType;
        ScheduledAt = scheduledAt;
    }

    /// <summary>
    /// Marks the job as currently running.
    /// </summary>
    public void MarkAsRunning()
    {
        if (Status == "SUCCESS" || Status == "FAILED")
        {
            throw new InvalidOperationException($"Cannot mark a {Status} job as running.");
        }
        Status = "RUNNING";
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marks the job as successfully completed.
    /// </summary>
    public void MarkAsSuccess()
    {
        if (Status == "FAILED")
        {
            throw new InvalidOperationException("Cannot mark a failed job as successful.");
        }
        Status = "SUCCESS";
        UpdatedAt = DateTime.UtcNow;
        ErrorMessage = null;
    }

    /// <summary>
    /// Marks the job as failed with the specified error message.
    /// </summary>
    /// <param name="errorMessage">Error message describing the failure</param>
    public void MarkAsFailed(string errorMessage)
    {
        if (Status == "SUCCESS")
        {
            throw new InvalidOperationException("Cannot mark a successful job as failed.");
        }
        Status = "FAILED";
        ErrorMessage = errorMessage;
        UpdatedAt = DateTime.UtcNow;
    }
}