using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using error.Domain.Entities;
using error.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using sb.Shared.Events;

namespace error.Infrastructure.Services
{
    // Background service to consume error events from RabbitMQ.
    public class ErrorConsumerService : BackgroundService
    {
        private readonly ILogger<ErrorConsumerService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private IConnection _connection;
        private IModel _channel;

        public ErrorConsumerService(ILogger<ErrorConsumerService> logger, IServiceScopeFactory scopeFactory, IConfiguration configuration)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _configuration = configuration;

            InitializeRabbitMq();
        }

        private void InitializeRabbitMq()
        {
            try
            {
                var factory = new ConnectionFactory()
                {
                    HostName = _configuration["RabbitMQ:Host"] ?? "localhost",
                    UserName = _configuration["RabbitMQ:Username"] ?? "guest",
                    Password = _configuration["RabbitMQ:Password"] ?? "guest",
                    Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                    DispatchConsumersAsync = true
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();
                _channel.QueueDeclare(queue: "error_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
                
                _logger.LogInformation("Connected to RabbitMQ.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not create RabbitMQ connection.");
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // If connection failed, do not proceed
            if (_connection == null || _channel == null)
            {
                _logger.LogWarning("RabbitMQ connection is not established. Consumer will not start.");
                return Task.CompletedTask;
            }

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    _logger.LogInformation("Received error message: {Message}", message);

                    var errorEvent = JsonSerializer.Deserialize<ErrorEvent>(message);
                    if (errorEvent != null)
                    {
                        using (var scope = _scopeFactory.CreateScope())
                        {
                            var errorLogRepository = scope.ServiceProvider.GetRequiredService<IErrorLogRepository>();
                            var errorLog = new ErrorLog(
                                Guid.NewGuid(),
                                errorEvent.Service,
                                errorEvent.CorrelationId,
                                errorEvent.Level,
                                errorEvent.Message,
                                errorEvent.Details?.ToString() ?? string.Empty,
                                errorEvent.Timestamp
                            );
                            await errorLogRepository.AddAsync(errorLog);
                            await errorLogRepository.SaveChangesAsync();
                        }
                    }
                    
                    // Acknowledge relevant message
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process error message.");
                    // Negative acknowledge, verify if strictly necessary or if we should just drop
                    // _channel.BasicNack(ea.DeliveryTag, false, false); 
                }
            };

            _channel.BasicConsume(queue: "error_queue", autoAck: false, consumer: consumer);
            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            try
            {
                _channel?.Close();
                _connection?.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while closing RabbitMQ connection");
            }
            
            base.Dispose();
        }
    }
}