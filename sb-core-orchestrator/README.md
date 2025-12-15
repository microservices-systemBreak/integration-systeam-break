# sb-core-orchestrator Microservice

## Table of Contents
1.  [Overview](#1-overview)
2.  [Architecture](#2-architecture)
3.  [Project Structure](#3-project-structure)
4.  [Key Features](#4-key-features)
5.  [Requirements](#5-requirements)
6.  [Getting Started](#6-getting-started)
    *   [Local Development Setup](#local-development-setup)
    *   [Build and Run with Docker Compose](#build-and-run-with-docker-compose)
    *   [Database Migrations](#database-migrations)
    *   [Run the Microservice Locally](#run-the-microservice-locally)
    *   [Verify with Swagger UI](#verify-with-swagger-ui)
7.  [API Endpoints](#7-api-endpoints)
8.  [Event Contracts](#8-event-contracts)
9.  [Configuration](#9-configuration)
10. [Testing](#10-testing)
11. [Further Development Considerations](#11-further-development-considerations)

---

## 1. Overview

The `sb-core-orchestrator` microservice acts as the central command and control unit within the SystemBreak security monitoring platform. It is responsible for orchestrating security scans, executing remote commands on monitored endpoints, and managing the lifecycle of these operations as jobs. This service communicates with external agents (e.g., Python agents on Linux machines) and a vulnerability analysis service, publishing events to notify other parts of the system about job progress and outcomes.

## 2. Architecture

This microservice adheres strictly to a **Clean Architecture** pattern, reinforced with **Domain-Driven Design (DDD)** principles. Responsibilities are divided into distinct layers with a clear dependency rule: inner layers are independent of outer layers.

*   **API**: Handles HTTP requests and responses, acting as the entry point. Depends on Application and Infrastructure.
*   **Application**: Contains the business logic and orchestrates operations. Defines interfaces for external dependencies (clients, repositories, event publishers). Depends on Domain.
*   **Domain**: Encapsulates core business entities, value objects, and events. It is the innermost layer and is independent of all other layers. It now features a **Rich Domain Model** where business logic is encapsulated within entities.
*   **Infrastructure**: Provides concrete implementations for interfaces defined in the Application layer, dealing with external concerns such as data persistence, external service clients, and message bus communication. Depends on Application and Domain.

## 3. Project Structure

The project is organized into the following directories, reflecting the Clean Architecture layers:

*   `core.Api/`: The entry point of the application.
    *   `Controllers/`: Contains API controllers (`ScanController.cs`, `CommandsController.cs`) that expose RESTful endpoints.
    *   `Program.cs`: Configures the web host, dependency injection, middleware, and endpoint routing.
    *   `appsettings.json`: Application configuration settings, including connection strings and service URLs.
*   `core.Application/`: Defines the application's use cases and orchestrates domain and infrastructure components.
    *   `Interfaces/`: Defines contracts for application services (`IScanService.cs`, `ICommandService.cs`), external clients (`IAgentClient.cs`, `IVulnAnalyzerClient.cs`), event publishers (`IEventPublisher.cs`), and data repositories (`IJobRepository.cs`, `IEndpointStateRepository.cs`).
    *   `Services/`: Provides concrete implementations of application services (`ScanService.cs`, `CommandService.cs`).
    *   `DTOs/`: Data Transfer Objects (`ScanRequest.cs`, `CommandRequest.cs`, `ScanResult.cs`, `CommandResult.cs`, `PackageListResponse.cs`, `VulnerabilityAnalysis.cs`, etc.) used for communication between layers and services.
*   `core.Domain/`: The heart of the business logic, independent of external concerns.
    *   `Entities/`: Core business entities (`Job.cs`, `EndpointState.cs`) now implement a **Rich Domain Model** with encapsulated business logic and protected state transitions.
    *   `Events/`: Domain events published by the service (`ScanCompletedEvent.cs`, `CommandExecutedEvent.cs`, `ErrorEvent.cs`).
*   `core.Infrastructure/`: Provides concrete implementations for interfaces defined in the Application layer, dealing with external systems.
    *   `Data/`: Database context (`CoreDbContext.cs`), EF Core configurations, and concrete **Repository implementations** (`JobRepository.cs`, `EndpointStateRepository.cs`).
    *   `Clients/`: Concrete HTTP client implementations for external services (`AgentClient.cs`, `VulnAnalyzerClient.cs`).
    *   `MessageBus/`: Concrete Event publishing mechanisms (`RabbitMqEventPublisher.cs`).
    *   `BackgroundServices/`: Hosted services for background tasks (`ScanSchedulerService.cs`).

## 4. Key Features

*   **Scan Orchestration**: Initiates package scans on remote endpoints via Python agents and processes results through a vulnerability analyzer.
*   **Command Execution**: Executes arbitrary remote commands on endpoints, providing feedback on success or failure.
*   **Job Management**: Tracks the lifecycle and status of all initiated scans and commands as `Job` entities, leveraging a **Rich Domain Model** for robust state management.
*   **Endpoint State Tracking**: Maintains the last known state and scan results for each monitored endpoint, also managed by a **Rich Domain Model**.
*   **Event-Driven Communication**: Publishes domain events (`ScanCompletedEvent`, `CommandExecutedEvent`, `ErrorEvent`) to RabbitMQ for asynchronous communication with other microservices.
*   **Scheduled Scans**: A background service (`ScanSchedulerService`) periodically triggers scans for registered endpoints.
*   **External Service Integration**: Communicates with `sb-vuln-analyzer` and remote Python agents via HTTP clients.
*   **Centralized Error Reporting**: Publishes `ErrorEvent` for any operational failures, allowing `sb-error-monitor` to centralize logging.
*   **Repository Pattern**: Utilizes a repository pattern for data access, decoupling application logic from persistence concerns.

## 5. Requirements

*   **.NET 9.0 SDK**: For building and running the application.
*   **Docker / Docker Compose**: For containerization and easy setup of dependencies (PostgreSQL, RabbitMQ).
*   **PostgreSQL 17+**: The primary database for job and endpoint state persistence.
*   **RabbitMQ 3.13+**: The message broker for event-driven communication.

## 6. Getting Started

### Local Development Setup

To ensure the `dotnet ef` tool works correctly for database migrations within your project context:

1.  **Ensure `Microsoft.EntityFrameworkCore.Tools` is referenced in `core.Api.csproj`**:
    ```xml
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.0">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    ```
2.  **Uninstall any global `dotnet-ef` tool** to avoid conflicts:
    ```bash
    dotnet tool uninstall --global dotnet-ef
    ```
    (It's okay if it says the tool is not found, it just means no global installation exists.)
3.  **Restore project packages** to ensure `Microsoft.EntityFrameworkCore.Tools` is available:
    ```bash
    dotnet restore
    ```

### Build and Run with Docker Compose

The easiest way to get the `sb-core-orchestrator` and its dependencies (PostgreSQL, RabbitMQ, `sb-vuln-analyzer`, `sb-error-monitor`) running is using Docker Compose.

1.  **Navigate to the monorepo root**:
    ```bash
    cd C:/Users/Msuthy/Desktop/Integration_systemBreack
    ```
2.  **Build and run core dependencies**:
    ```bash
    docker-compose up -d postgres rabbitmq
    ```
    This command will start the PostgreSQL and RabbitMQ containers in detached mode.
3.  **Verify containers are running**:
    ```bash
    docker-compose ps
    ```

### Database Migrations

After the database container is up, you need to apply Entity Framework Core migrations to create the schema.

1.  **Open a terminal in the `sb-core-orchestrator/core.Api` directory.**
    ```bash
    cd C:/Users/Msuthy/Desktop/Integration_systemBreack/sb-core-orchestrator/core.Api
    ```
2.  **Apply migrations**:
    ```bash
    dotnet ef database update
    ```

### Run the Microservice Locally

1.  **In the same terminal** (in `sb-core-orchestrator/core.Api`), execute the project:
    ```bash
    dotnet run
    ```
    The application will start and listen on configured URLs (e.g., `http://localhost:8080`).

### Verify with Swagger UI

1.  **Open your web browser** and navigate to the Swagger UI URL (e.g., `http://localhost:8080/swagger`).
2.  You should see the API documentation for `ScanController` and `CommandsController`, confirming the service is running and exposing its endpoints.

## 7. API Endpoints

The service exposes the following RESTful API endpoints:

### Initiate Package Scan
*   **Endpoint**: `POST /core/requests/scan-packages`
*   **Description**: Requests a package scan on a specified endpoint.
*   **Request Body (`application/json`)**:
    ```json
    {
      "endpointId": "pc01",
      "scanType": "PACKAGES_FULL",
      "requestedBy": "tester"
    }
    ```
*   **Headers**:
    *   `X-Correlation-Id`: `TEST-SCAN-001` (Required, for tracing)
*   **Responses**:
    *   `202 Accepted`:
        ```json
        {
          "jobId": "SCAN-20231027-abcdef12",
          "status": "ACCEPTED",
          "correlationId": "TEST-SCAN-001"
        }
        ```
    *   `400 Bad Request`: If `X-Correlation-Id` is missing or request body is invalid.

### Execute Remote Command
*   **Endpoint**: `POST /core/commands`
*   **Description**: Requests the execution of a remote command on a specified endpoint.
*   **Request Body (`application/json`)**:
    ```json
    {
      "endpointId": "pc01",
      "action": "APPLY_SECURITY_UPDATES",
      "params": {
        "maxDurationMinutes": 30
      },
      "requestedBy": "tester",
      "reason": "Test command"
    }
    ```
*   **Headers**:
    *   `X-Correlation-Id`: `TEST-CMD-001` (Required, for tracing)
*   **Responses**:
    *   `202 Accepted`:
        ```json
        {
          "jobId": "CMD-20231027-ghijkl34",
          "status": "ACCEPTED",
          "correlationId": "TEST-CMD-001"
        }
        ```
    *   `400 Bad Request`: If `X-Correlation-Id` is missing or request body is invalid.

## 8. Event Contracts

The `sb-core-orchestrator` publishes the following events to RabbitMQ:

*   **`ScanCompletedEvent`**: Published upon successful completion of a package scan.
    *   **Queue**: `scan_completed_queue`
    *   **Content**: `JobId`, `EndpointId`, `CorrelationId`, `CompletedAt`, `Result` (OverallSeverity, VulnerabilitiesFound, PackagesAnalyzed).
*   **`CommandExecutedEvent`**: Published upon completion (success or failure) of a remote command execution.
    *   **Queue**: `command_executed_queue`
    *   **Content**: `JobId`, `EndpointId`, `CorrelationId`, `Action`, `Status`, `ExecutedAt`, `Details`.
*   **`ErrorEvent`**: Published whenever an unhandled exception or critical error occurs during a job's processing.
    *   **Queue**: `error_queue`
    *   **Content**: `Service`, `CorrelationId`, `Level`, `Message`, `Details`, `Timestamp`.

## 9. Configuration

Key configuration settings are managed via `appsettings.json` and environment variables:

*   `ConnectionStrings:DefaultConnection`: PostgreSQL connection string.
*   `RabbitMQ:Host`, `RabbitMQ:Username`, `RabbitMQ:Password`, `RabbitMQ:Port`: RabbitMQ connection details.
*   `Services:VulnAnalyzer`: Base URL for the `sb-vuln-analyzer` microservice.
*   `Services:AgentBaseUrlTemplate`: Template for constructing agent URLs (e.g., `http://{0}:5000`).
*   `Scheduler:IntervalSeconds`: Interval for the background scan scheduler.

## 10. Testing

To ensure the reliability and correctness of the `sb-core-orchestrator` microservice, a comprehensive testing strategy is recommended:

*   **Unit Tests**: Focus on individual components (services, DTOs, entities) in isolation. With the **Rich Domain Model** and **Repository Pattern**, testing business logic within entities and application services is more straightforward. Use frameworks like xUnit and mocking libraries like Moq to test business logic without external dependencies.
    *   **Example**: Test `Job` entity methods (`MarkAsSuccess`, `MarkAsFailed`) for correct state transitions. Test `ScanService.ExecutePackageScanAsync` to ensure correct job creation, client calls, and event publishing logic, mocking `IAgentClient`, `IVulnAnalyzerClient`, `IEventPublisher`, `IJobRepository`, and `IEndpointStateRepository`.
*   **Integration Tests**: Verify interactions between layers and with external dependencies (database, message broker, other microservices). Use test containers for PostgreSQL and RabbitMQ, and mock HTTP servers for external clients.
    *   **Example**: Test the entire flow from `ScanController` to `ScanService` and its interaction with `IJobRepository`, `IEndpointStateRepository`, and `IEventPublisher` (which would interact with `CoreDbContext` and `RabbitMqEventPublisher` in the infrastructure layer).
*   **API Tests**: Validate the behavior of the RESTful endpoints, including request/response formats, status codes, and error handling. Tools like Postman or automated API testing frameworks can be used.

## 11. Further Development Considerations

*   **Resilience**: Implement advanced resilience patterns (e.g., using Polly) for HTTP client calls to external services (agents, vulnerability analyzer) to handle transient faults, timeouts, and circuit breaking.
*   **Distributed Transactions/Outbox Pattern**: To ensure atomicity between database operations (e.g., saving a `Job`) and event publishing, consider implementing the Outbox pattern.
*   **Event Contracts Library**: For better maintainability and type safety across microservices, define shared event DTOs in a dedicated NuGet package or shared library.
*   **Advanced Scheduling**: Enhance `ScanSchedulerService` to support more complex scheduling configurations (e.g., cron expressions, per-endpoint schedules).
*   **Authentication and Authorization**: Implement security measures for API access.
*   **Observability**: Integrate with distributed tracing (e.g., OpenTelemetry) and metrics (e.g., Prometheus) for better monitoring in production.
