using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using core.Application.Commands.Scan;
using core.Application.Interfaces;
using core.Domain.Entities;
using sb.Shared.Events;
using core.Application.DTOs;

namespace core.UnitTests.CommandHandlers;

public class CreateScanCommandHandlerTests
{
    private readonly Mock<IAgentClient> _mockAgentClient;
    private readonly Mock<IVulnAnalyzerClient> _mockVulnAnalyzerClient;
    private readonly Mock<IEventPublisher> _mockEventPublisher;
    private readonly Mock<IJobRepository> _mockJobRepository;
    private readonly Mock<IEndpointStateRepository> _mockEndpointStateRepository;
    private readonly Mock<ILogger<CreateScanCommandHandler>> _mockLogger;
    private readonly CreateScanCommandHandler _handler;

    public CreateScanCommandHandlerTests()
    {
        _mockAgentClient = new Mock<IAgentClient>();
        _mockVulnAnalyzerClient = new Mock<IVulnAnalyzerClient>();
        _mockEventPublisher = new Mock<IEventPublisher>();
        _mockJobRepository = new Mock<IJobRepository>();
        _mockEndpointStateRepository = new Mock<IEndpointStateRepository>();
        _mockLogger = new Mock<ILogger<CreateScanCommandHandler>>();

        _handler = new CreateScanCommandHandler(
            _mockAgentClient.Object,
            _mockVulnAnalyzerClient.Object,
            _mockEventPublisher.Object,
            _mockJobRepository.Object,
            _mockEndpointStateRepository.Object,
            _mockLogger.Object
        );
    }

    [Fact]
    public async Task Handle_ShouldCompleteScanSuccessfully_WhenDependenciesSucceed()
    {
        // Arrange
        var request = new ScanRequest { EndpointId = "test-endpoint", ScanType = "full" };
        var command = new CreateScanCommand(request, "12345");
        
        var packages = new PackageListResponse 
        { 
            AgentId = "test-endpoint", 
            Packages = new List<PackageInfo> { new PackageInfo { Name = "test-pkg", Version = "1.0" } } 
        };
        
        var analysis = new VulnerabilityAnalysis 
        { 
            OverallSeverity = "LOW", 
            Vulnerabilities = new List<Vulnerability>() 
        };

        _mockAgentClient.Setup(x => x.GetPackagesAsync(request.EndpointId, request.ScanType))
            .ReturnsAsync(packages);
            
        _mockVulnAnalyzerClient.Setup(x => x.AnalyzePackagesAsync(packages))
            .ReturnsAsync(analysis);
            
        _mockEndpointStateRepository.Setup(x => x.GetByIdAsync(request.EndpointId))
            .ReturnsAsync((EndpointState?)null); // Simulate new endpoint

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("12345", result.CorrelationId);
        
        // Verify interactions
        _mockJobRepository.Verify(x => x.AddAsync(It.IsAny<Job>()), Times.Once);
        _mockAgentClient.Verify(x => x.GetPackagesAsync(request.EndpointId, request.ScanType), Times.Once);
        _mockVulnAnalyzerClient.Verify(x => x.AnalyzePackagesAsync(packages), Times.Once);
        _mockEndpointStateRepository.Verify(x => x.AddAsync(It.IsAny<EndpointState>()), Times.Once);
        _mockEventPublisher.Verify(x => x.PublishScanCompletedAsync(It.Is<ScanCompletedEvent>(e => 
            e.EndpointId == request.EndpointId && 
            e.Result.OverallSeverity == "LOW")), Times.Once);
    }
}
