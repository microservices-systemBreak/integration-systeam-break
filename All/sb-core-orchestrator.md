# SBOM Core Orchestrator (`sb-core-orchestrator`)

## General Description
This microservice acts as the central orchestrator of the system. It is responsible for managing scan jobs, maintaining endpoint state, and coordinating communication between different system components via commands and events. It follows the CQRS (Command Query Responsibility Segregation) pattern using MediatR.

## Architecture and Composition
The project follows a Clean Architecture divided into four main layers:

### 1. Presentation Layer (`core.Api`)
Contains the REST API controllers and initial application configuration (`Program.cs`). It is the entry point for HTTP requests.
- **Controllers**:
    - `CommandsController`: Handles execution of arbitrary commands on agents.
    - `EndpointController`: Manages registration and querying of endpoints (monitored devices/servers).
    - `ScanController`: Initiates and queries the status of vulnerability scan jobs.
- **Program.cs**: Configures dependency injection, database connection (PostgreSQL), Message Bus (RabbitMQ), HTTP clients, and background services.

### 2. Application Layer (`core.Application`)
Contains business logic, command/query definitions (CQRS), and interfaces.
- **Commands**: Logic to modify state (e.g., `CreateScanCommand`).
- **Interfaces**: Contracts for repositories and external services (`IJobRepository`, `IAgentClient`).

### 3. Domain Layer (`core.Domain`)
Contains domain entities and pure business rules. No external dependencies.
- **Entities**: Data models like `Job`, `EndpointState`, etc.

### 4. Infrastructure Layer (`core.Infrastructure`)
Implements the application layer interfaces. Handles persistence and external communication.
- **Data**: Implementation of `CoreDbContext` with Entity Framework Core.
- **Repositories**: `JobRepository`, `EndpointStateRepository`.
- **Clients**:
    - `AgentClient`: HTTP client to communicate with agents installed on endpoints.
    - `VulnAnalyzerClient`: HTTP client to communicate with the vulnerability analysis service (`sb-vuln-analyzer`).
- **MessageBus**: `RabbitMqEventPublisher` for publishing events to the message queue.
- **BackgroundServices**: `ScanSchedulerService` for scheduled tasks.

## Key Technologies
- **.NET 8**: Main framework.
- **Entity Framework Core**: ORM for PostgreSQL (`NpgSql`).
- **MediatR**: Implementation of the mediator pattern to decouple controllers from business logic.
- **RabbitMQ**: Message broker for asynchronous communication.
- **Swagger**: Automatic API documentation.

## Key Files and Justification
- `appsettings.json`: Configuration of connection strings and external service endpoints.
- `Dockerfile`: Definition for building the service's Docker image.
