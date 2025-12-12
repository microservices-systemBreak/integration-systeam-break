using Microsoft.AspNetCore.Mvc;
using error.Domain.Entities;
using error.Application.Interfaces;

namespace error.Api.Controllers
{
    // Controller for managing error logs.
    [ApiController]
    [Route("errors")]
    public class ErrorsController : ControllerBase
    {
        private readonly IErrorLogRepository _errorLogRepository;
        private readonly ILogger<ErrorsController> _logger;

        public ErrorsController(IErrorLogRepository errorLogRepository, ILogger<ErrorsController> logger)
        {
            _errorLogRepository = errorLogRepository;
            _logger = logger;
        }

        // Retrieves a paginated list of error logs, optionally filtered by service.
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetErrors([FromQuery] string service, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                _logger.LogInformation("Querying errors for service: {Service}", service);
                
                var errors = await _errorLogRepository.GetByServiceAsync(service, page, pageSize);
                return Ok(errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving logs for service {Service}", service);
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }

        // Marks an error as resolved.
        [HttpPut("{id}/resolve")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResolveError(Guid id)
        {
            try
            {
                var errorLog = await _errorLogRepository.GetByIdAsync(id);
                if (errorLog == null)
                {
                    return NotFound();
                }

                errorLog.MarkAsResolved();
                _errorLogRepository.Update(errorLog);
                await _errorLogRepository.SaveChangesAsync();

                _logger.LogInformation("Error {ErrorId} marked as resolved.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving error log {ErrorId}", id);
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
    }
}