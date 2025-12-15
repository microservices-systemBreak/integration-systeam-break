using MediatR;
using Microsoft.AspNetCore.Mvc;
using core.Application.Commands.Scan;
using core.Application.DTOs;

namespace core.Api.Controllers;

[Route("core/requests")]
[ApiController]
public class ScanController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ScanController> _logger;

    public ScanController(IMediator mediator, ILogger<ScanController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Initiates a package scan on a specified endpoint.
    [HttpPost("scan-packages")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ScanPackages(
        [FromBody] ScanRequest request,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId)
    {
        try
        {
            if (string.IsNullOrEmpty(correlationId))
                return BadRequest("X-Correlation-Id header is required");

            _logger.LogInformation("Scan requested for {EndpointId} with correlation {CorrelationId}", request.EndpointId, correlationId);

            var command = new CreateScanCommand(request, correlationId);
            var result = await _mediator.Send(command);
            
            return Accepted(new 
            { 
                jobId = result.JobId, 
                status = "ACCEPTED", 
                correlationId = result.CorrelationId 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing scan request for {EndpointId}", request.EndpointId);
            return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
        }
    }
}