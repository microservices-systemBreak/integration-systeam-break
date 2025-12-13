namespace core.Application.DTOs
{
    public class ScanRequest
    {
        public string EndpointId { get; set; } = string.Empty;
        public string ScanType { get; set; } = "PACKAGES_FULL";
        public string RequestedBy { get; set; } = string.Empty;
    }
    
    public class ScanResult
    {
        public string JobId { get; set; } = string.Empty;
        public string CorrelationId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}