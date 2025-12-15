using MediatR;
using Microsoft.AspNetCore.Mvc;
using core.Application.Commands.Command;
using core.Application.DTOs;

namespace core.Api.Controllers;

[Route("core/commands")]
[ApiController]
public class CommandController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<CommandController> _logger;

    public CommandController(IMediator mediator, ILogger<CommandController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Executes a remote command on a specified endpoint.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ExecuteCommand(
        [FromBody] CommandRequest request,
        [FromHeader(Name = "X-Correlation-Id")] string correlationId)
    {
        try
        {
            if (string.IsNullOrEmpty(correlationId))
                return BadRequest("X-Correlation-Id header is required");

            _logger.LogInformation("Command {Action} requested for {EndpointId} with correlation {CorrelationId}", request.Action, request.EndpointId, correlationId);

            var command = new CreateCommandCommand(request, correlationId);
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
            _logger.LogError(ex, "Error executing command for {EndpointId}", request.EndpointId);
            return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
        }
    }
}