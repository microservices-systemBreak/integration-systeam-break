namespace core.Application.DTOs;

/// <summary>
/// Data Transfer Object for endpoint status information.
/// Used as response for GET /core/endpoints/{endpointId}/status
/// </summary>
public class EndpointStatusDto
{
    public string EndpointId { get; set; } = string.Empty;
    public bool Online { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime? LastScanAt { get; set; }
    public string OverallSeverity { get; set; } = "NONE";
}
