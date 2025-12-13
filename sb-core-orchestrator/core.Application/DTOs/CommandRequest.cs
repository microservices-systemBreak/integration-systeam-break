namespace core.Application.DTOs
{
    public class CommandRequest
    {
        public string EndpointId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public Dictionary<string, object> Params { get; set; } = new();
        public string RequestedBy { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
    }
    
    public class CommandResult
    {
        public string JobId { get; set; } = string.Empty;
        public string CorrelationId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}