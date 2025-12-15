using MediatR;
using Microsoft.AspNetCore.Mvc;
using core.Application.Queries.GetEndpointStatus;

namespace core.Api.Controllers;

[Route("core/endpoints")]
[ApiController]
public class EndpointController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<EndpointController> _logger;

    public EndpointController(IMediator mediator, ILogger<EndpointController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Retrieves the current status of a specific endpoint.
    [HttpGet("{endpointId}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetStatus(string endpointId)
    {
        try
        {
            _logger.LogInformation("Getting status for endpoint {EndpointId}", endpointId);
            
            var query = new GetEndpointStatusQuery(endpointId);
            var result = await _mediator.Send(query);
            
            if (result == null)
            {
                _logger.LogWarning("Endpoint {EndpointId} not found", endpointId);
                return NotFound(new { message = $"Endpoint '{endpointId}' not found" });
            }
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving status for endpoint {EndpointId}", endpointId);
            return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
        }
    }
}
