using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using error.Infrastructure.Services;
using error.Application.Interfaces;
using error.Domain.Entities;
using sb.Shared.Events;
using System.Text.Json;

namespace error.UnitTests.Services;

public class ErrorConsumerServiceTests
{
    private readonly Mock<ILogger<ErrorConsumerService>> _mockLogger;
    private readonly Mock<IServiceScopeFactory> _mockScopeFactory;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<IServiceScope> _mockScope;
    private readonly Mock<IServiceProvider> _mockServiceProvider;
    private readonly Mock<IErrorLogRepository> _mockRepository;

    public ErrorConsumerServiceTests()
    {
        _mockLogger = new Mock<ILogger<ErrorConsumerService>>();
        _mockScopeFactory = new Mock<IServiceScopeFactory>();
        _mockConfiguration = new Mock<IConfiguration>();
        _mockScope = new Mock<IServiceScope>();
        _mockServiceProvider = new Mock<IServiceProvider>();
        _mockRepository = new Mock<IErrorLogRepository>();

        _mockScopeFactory.Setup(x => x.CreateScope()).Returns(_mockScope.Object);
        _mockScope.Setup(x => x.ServiceProvider).Returns(_mockServiceProvider.Object);
        _mockServiceProvider.Setup(x => x.GetService(typeof(IErrorLogRepository)))
            .Returns(_mockRepository.Object);
            
        // Mock configuration to avoid nulls in InitRabbitMq (though we won't execute it, constructor calls it)
        // Wait, Constructor calls InitRabbitMq which calls new ConnectionFactory(). This might throw or try to connect.
        // We need to prevent InitRabbitMq from failing or connecting to real RabbitMQ.
        // But InitRabbitMq is private and called in Constructor.
        // Refactoring to make InitRabbitMq virtual/protected or checking configuration might be needed to avoid side effects during test instantiation.
        // Assuming unit test environment doesn't break on "localhost" connection failure inside constructor (it catches exception).
        _mockConfiguration.Setup(x => x["RabbitMQ:Host"]).Returns("nonexistent-host");
    }

    [Fact]
    public async Task ProcessErrorEventAsync_ShouldSaveErrorLog_WhenEventIsValid()
    {
        // Arrange
        // We need a subclass or way to instantiation without crashing if InitRabbitMq fails.
        // Fortunately, InitRabbitMq catches generic Exception and logs it. So new ErrorConsumerService(...) should work even if RabbitMQ fails.
        
        var service = new ErrorConsumerService(_mockLogger.Object, _mockScopeFactory.Object, _mockConfiguration.Object);
        
        var errorEvent = new ErrorEvent
        {
            Service = "TestService",
            CorrelationId = "123",
            Level = "Critical",
            Message = "Test Error",
            Timestamp = DateTime.UtcNow
        };
        var message = JsonSerializer.Serialize(errorEvent);

        // Act
        await service.ProcessErrorEventAsync(message);

        // Assert
        _mockRepository.Verify(x => x.AddAsync(It.Is<ErrorLog>(e => 
            e.Service == "TestService" && 
            e.Message == "Test Error")), Times.Once);
        _mockRepository.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}
