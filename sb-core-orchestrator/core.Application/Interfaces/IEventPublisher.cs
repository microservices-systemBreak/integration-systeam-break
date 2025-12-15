namespace core.Application.Interfaces;

using sb.Shared.Events;

/// <summary>
/// Interface for publishing domain events to the message bus.
/// </summary>
public interface IEventPublisher
{
    Task PublishScanCompletedAsync(ScanCompletedEvent scanEvent);
    Task PublishCommandExecutedAsync(CommandExecutedEvent commandEvent);
    Task PublishErrorAsync(ErrorEvent errorEvent);
}
