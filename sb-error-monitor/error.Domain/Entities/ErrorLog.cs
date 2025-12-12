using System;

namespace error.Domain.Entities
{
    // Represents a single error log entry.
    public class ErrorLog
    {
        // EF Core requires a parameterless constructor
        private ErrorLog() { }

        // Initializes a new instance of the ErrorLog class.
        public ErrorLog(Guid id, string service, string correlationId, string level, string message, string details, DateTime timestamp)
        {
            Id = id;
            Service = service;
            CorrelationId = correlationId;
            Level = level;
            Message = message;
            Details = details;
            Timestamp = timestamp;
            IsResolved = false; // Default state
        }

        public Guid Id { get; private set; }
        public string Service { get; private set; }
        public string CorrelationId { get; private set; }
        public string Level { get; private set; }
        public string Message { get; private set; }
        public string Details { get; private set; }
        public DateTime Timestamp { get; private set; }
        public bool IsResolved { get; private set; }

        // Marks the error log as resolved.
        public void MarkAsResolved()
        {
            IsResolved = true;
        }
    }
}