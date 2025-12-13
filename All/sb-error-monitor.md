# SBOM Error Monitor (`sb-error-monitor`)

## General Description
This service is responsible for centralizing the logging and monitoring of system errors. It listens for error events emitted by other components (such as the orchestrator) and persists them for later analysis.

## Architecture and Composition
It follows the Clean Architecture pattern, with a particular focus on background event processing.

### 1. Presentation Layer (`error.Api`)
- **Controllers**:
    - `ErrorsController`: Allows querying of registered error history (Logs).
- **Program.cs**: Configures the event consumer and data access.

### 2. Application Layer (`error.Application`)
- **Interfaces**: Contracts for repositories.

### 3. Infrastructure Layer (`error.Infrastructure`)
- **Data**: Database context `ErrorDbContext`.
- **Services**:
    - `ErrorConsumerService`: A `HostedService` (background service) that connects to the message bus (RabbitMQ) to consume `ErrorEvent` and save them to the database.
- **Repositories**: `ErrorLogRepository`.

## Key Technologies
- **.NET 8/9**: Platform.
- **RabbitMQ**: Message consumer to decouple error reporting from the main flow.
- **PostgreSQL**: Persistent storage for error logs.

## Key Files and Justification
- `appsettings.json`: Configuration for RabbitMQ and PostgreSQL connections.
- `Dockerfile`: Container image construction.
