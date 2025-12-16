namespace core.Infrastructure.MessageBus;

using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using sb.Shared.Events;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using core.Application.Interfaces;

/// <summary>
/// RabbitMQ implementation of the event publisher.
/// </summary>
public class RabbitMqEventPublisher : IEventPublisher, IDisposable
{
    private readonly ILogger<RabbitMqEventPublisher> _logger;
    private readonly IConnection? _connection;
    private readonly IModel? _channel;

    public RabbitMqEventPublisher(IConfiguration configuration, ILogger<RabbitMqEventPublisher> logger)
    {
        _logger = logger;
        try
        {
            var port = configuration["RabbitMQ:Port"];
            if (string.IsNullOrEmpty(port))
            {
                throw new ArgumentException("RabbitMQ port is not configured.");
            }
            
            var factory = new ConnectionFactory()
            {
                HostName = configuration["RabbitMQ:Host"],
                UserName = configuration["RabbitMQ:Username"],
                Password = configuration["RabbitMQ:Password"],
                Port = int.Parse(port)
            };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            // Declare queues to ensure they exist
            _channel.QueueDeclare(queue: "scan_completed_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueDeclare(queue: "command_executed_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueDeclare(queue: "error_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
            
            _logger.LogInformation("Successfully connected to RabbitMQ");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not connect to RabbitMQ");
            throw; // Re-throw to make failures visible
        }
    }

    public Task PublishScanCompletedAsync(ScanCompletedEvent scanEvent)
    {
        return PublishEventAsync("scan_completed_queue", scanEvent);
    }

    public Task PublishCommandExecutedAsync(CommandExecutedEvent commandEvent)
    {
        return PublishEventAsync("command_executed_queue", commandEvent);
    }

    public Task PublishErrorAsync(ErrorEvent errorEvent)
    {
        return PublishEventAsync("error_queue", errorEvent);
    }

    private Task PublishEventAsync<T>(string queueName, T eventData)
    {
        if (_connection == null || !_connection.IsOpen || _channel == null)
        {
            _logger.LogError("Cannot publish event, RabbitMQ connection is not open.");
            return Task.CompletedTask;
        }

        try
        {
            var message = JsonSerializer.Serialize(eventData);
            var body = Encoding.UTF8.GetBytes(message);

            // Ensure the destination queue exists using the provided queue name
            _channel.QueueDeclare(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            _channel.BasicPublish(
                exchange: "",
                routingKey: queueName,
                basicProperties: null,
                body: body);
            _logger.LogInformation("Published event to {QueueName}: {Message}", queueName, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish event to {QueueName}", queueName);
        }
        
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
