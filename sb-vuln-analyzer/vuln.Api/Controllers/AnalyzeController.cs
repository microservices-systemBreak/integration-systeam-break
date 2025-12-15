using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using vuln.Application.DTOs;
using vuln.Application.Interfaces;

namespace vuln.Api.Controllers
{
    // Controller for managing package vulnerability analysis.
    [ApiController]
    [Route("analyze")]
    [Produces("application/json")]
    public class AnalyzeController : ControllerBase
    {
        private readonly IAnalysisService _analysisService;
        private readonly ILogger<AnalyzeController> _logger;

        public AnalyzeController(IAnalysisService analysisService, ILogger<AnalyzeController> logger)
        {
            _analysisService = analysisService ?? throw new ArgumentNullException(nameof(analysisService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Analyzes a list of packages for vulnerabilities.
        [HttpPost("packages")]
        [ProducesResponseType(typeof(VulnerabilityAnalysis), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AnalyzePackages(
            [FromBody, Required] AnalysisRequest request,
            [FromHeader(Name = "X-Correlation-Id")] string correlationId = null)
        {
            try
            {
                // Generate a unique correlation ID if one was not provided
                correlationId ??= $"ANALYSIS-{Guid.NewGuid():N}";
                
                _logger.LogInformation("Received analysis request for {AgentId} with correlation {CorrelationId}", request.AgentId, correlationId);

                var result = await _analysisService.AnalyzePackagesAsync(request, correlationId);

                _logger.LogInformation("Analysis completed for {AgentId}. Found {VulnerabilityCount} vulnerabilities.", request.AgentId, result.Vulnerabilities.Count);

                return Ok(result);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for analysis request with correlation {CorrelationId}", correlationId);
                return BadRequest(new ValidationProblemDetails(new Dictionary<string, string[]> {
                    { "Validation", new[] { ex.Message } }
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing analysis request with correlation {CorrelationId}", correlationId);
                return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
                {
                    Title = "An unexpected error occurred",
                    Detail = "Please try again later or contact support"
                });
            }
        }
    }
}