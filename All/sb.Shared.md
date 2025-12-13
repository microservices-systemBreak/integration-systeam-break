# SBOM Shared Library (`sb.Shared`)

## General Description
This Class Library acts as the common core for sharing event definitions between different microservices. Its primary purpose is to ensure that all services "speak the same language" when communicating via the message bus (RabbitMQ).

## Content and Justification
The project contains event definitions that are published by one service and consumed by others. Sharing this project avoids code duplication and guarantees consistency in message serialization/deserialization.

### Events (`Events/`)
- **`CommandExecutedEvent.cs`**: Event indicating that a command has been executed, likely by an agent. Contains details about the execution result.
- **`ErrorEvent.cs`**: Event to notify errors occurring in the system, allowing the error monitoring service (`sb-error-monitor`) to log and process them.
- **`ScanCompletedEvent.cs`**: Event triggered when a vulnerability scan job has partially or fully completed. Contains scan results to be processed or stored.

## Technologies
- **.NET 9**: Standard class library compatible with main projects.
