# sb-error-monitor Microservice

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
8.  [Event Contracts (Consumed)](#8-event-contracts-consumed)
9.  [Configuration](#9-configuration)
10. [Testing](#10-testing)
11. [Further Development Considerations](#11-further-development-considerations)

---

## 1. Overview

The `sb-error-monitor` microservice serves as the centralized error monitoring and logging component within the SystemBreak platform. It passively listens for `ErrorEvent` messages published by other microservices (e.g., `sb-core-orchestrator`) via RabbitMQ, persists these error logs to a PostgreSQL database, and provides a RESTful API for querying and retrieving recorded errors. This service is crucial for maintaining system observability and facilitating rapid incident response.

## 2. Architecture

This microservice adheres strictly to a **Clean Architecture** pattern, reinforced with **Domain-Driven Design (DDD)** principles. Responsibilities are divided into distinct layers with a clear dependency rule: inner layers are independent of outer layers.

*   **API**: Handles HTTP requests and responses for querying errors. Depends on Application and Infrastructure.
*   **Application**: Defines interfaces for data repositories.
*   **Domain**: Encapsulates core business entities (like error logs). It is the innermost layer and is independent of all other layers. It now features a **Rich Domain Model** where business logic is encapsulated within entities.
*   **Infrastructure**: Provides concrete implementations for interfaces defined in the Application layer, dealing with external concerns such as data persistence (error log database) and message bus consumption. Depends on Application and Domain.

## 3. Project Structure

The project is organized into the following directories, reflecting the Clean Architecture layers:

*   `error.Api/`: The entry point of the application.
    *   `Controllers/`: Contains API controllers (`ErrorsController.cs`) that expose RESTful endpoints for querying error logs.
    *   `Program.cs`: Configures the web host, dependency injection, middleware, and endpoint routing.
    *   `appsettings.json`: Application configuration settings, including connection strings and RabbitMQ details.
*   `error.Application/`: Defines the application's use cases and orchestrates domain and infrastructure components.
    *   `Interfaces/`: Defines contracts for data repositories (`IErrorLogRepository.cs`).
*   `error.Domain/`: The heart of the business logic, independent of external concerns.
    *   `Entities/`: Core business entities (`ErrorLog.cs`) now implement a **Rich Domain Model** with encapsulated business logic and protected state transitions.
*   `error.Infrastructure/`: Provides concrete implementations for interfaces defined in the Application layer, dealing with external systems.
    *   `Data/`: Database context (`ErrorDbContext.cs`) and EF Core configurations, and concrete **Repository implementations** (`ErrorLogRepository.cs`).
    *   `Services/`: Contains background services (`ErrorConsumerService.cs`) responsible for consuming messages from RabbitMQ.

## 4. Key Features

*   **Centralized Error Logging**: Consumes `ErrorEvent` messages from a RabbitMQ queue and stores them in a PostgreSQL database.
*   **Error Query API**: Provides a RESTful endpoint to retrieve error logs, with filtering capabilities (e.g., by service) and pagination.
*   **Error Persistence**: Stores detailed error information, including service, correlation ID, level, message, and timestamp, utilizing the **Repository Pattern** for data access.
*   **Background Consumption**: Utilizes a `BackgroundService` to continuously listen for incoming error events without blocking the main application thread.
*   **Health Checks**: Exposes health endpoints for monitoring database and RabbitMQ connectivity.

## 5. Requirements

*   **.NET 9.0 SDK**: For building and running the application.
*   **Docker / Docker Compose**: For containerization and easy setup of dependencies (PostgreSQL, RabbitMQ).
*   **PostgreSQL 17+**: The primary database for error log persistence.
*   **RabbitMQ 3.13+**: The message broker from which error events are consumed.

## 6. Getting Started

### Local Development Setup

To ensure the `dotnet ef` tool works correctly for database migrations within your project context:

1.  **Ensure `Microsoft.EntityFrameworkCore.Tools` is referenced in `error.Api.csproj`**:
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

### Build and Run Locally
To build the project specifically:
```bash
dotnet build error.monitor.sln
```

### Build and Run with Docker Compose


The easiest way to get the `sb-error-monitor` and its dependencies (PostgreSQL, RabbitMQ) running is using Docker Compose.

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

1.  **Open a terminal in the `sb-error-monitor/error.Api` directory.**
    ```bash
    cd C:/Users/Msuthy/Desktop/Integration_systemBreack/sb-error-monitor/error.Api
    ```
2.  **Apply migrations**:
    ```bash
    dotnet ef database update
    ```

### Run the Microservice Locally

1.  **In the same terminal** (in `sb-error-monitor/error.Api`), execute the project:
    ```bash
    dotnet run
    ```
    The application will start and listen on configured URLs (e.g., `http://localhost:8082`).

### Verify with Swagger UI

1.  **Open your web browser** and navigate to the Swagger UI URL (e.g., `http://localhost:8082/swagger`).
2.  You should see the API documentation for `ErrorsController`, confirming the service is running and exposing its endpoints.

## 7. API Endpoints

The service exposes the following RESTful API endpoints:

### Retrieve Error Logs
*   **Endpoint**: `GET /errors`
*   **Description**: Retrieves a paginated list of error logs, optionally filtered by service.
*   **Query Parameters**:
    *   `service` (string, optional): Filters errors by the originating service name.
    *   `page` (int, optional, default: 1): The page number for pagination.
    *   `pageSize` (int, optional, default: 20): The number of items per page.
*   **Responses**:
    *   `200 OK`:
        ```json
        [
          {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "service": "sb-core-orchestrator",
            "correlationId": "TEST-SCAN-001",
            "level": "ERROR",
            "message": "Scan failed for pc01: Connection refused",
            "details": "{ \"EndpointId\": \"pc01\", \"Error\": \"Connection refused\" }",
            "timestamp": "2023-10-27T10:30:00Z",
            "isResolved": false
          },
          {
            "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
            "service": "sb-core-orchestrator",
            "correlationId": "TEST-CMD-001",
            "level": "ERROR",
            "message": "Command APPLY_SECURITY_UPDATES failed for pc01: Agent offline",
            "details": "{ \"EndpointId\": \"pc01\", \"Action\": \"APPLY_SECURITY_UPDATES\", \"Error\": \"Agent offline\" }",
            "timestamp": "2023-10-27T10:35:00Z",
            "isResolved": false
          }
        ]
        ```
    *   `500 Internal Server Error`: For unexpected server-side issues.

### Resolve Error
*   **Endpoint**: `PUT /errors/{id}/resolve`
*   **Description**: Marks a specific error log as resolved.
*   **Path Parameters**:
    *   `id` (GUID, required): The unique identifier of the error log to resolve.
*   **Responses**:
    *   `204 No Content`: Error successfully marked as resolved.
    *   `404 Not Found`: If the error with the given ID does not exist.
    *   `500 Internal Server Error`: For unexpected server-side issues.

## 8. Event Contracts (Consumed)

The `sb-error-monitor` consumes the following event from RabbitMQ:

*   **`ErrorEvent`**: Published by other services whenever an unhandled exception or critical error occurs.
    *   **Queue**: `error_queue`
    *   **Content**: `Service`, `CorrelationId`, `Level`, `Message`, `Details`, `Timestamp`.
    *   **Note**: The `ErrorEvent` contract is expected to be consistent across all publishing services.

## 9. Configuration

Key configuration settings are managed via `appsettings.json` and environment variables:

*   `ConnectionStrings:DefaultConnection`: PostgreSQL connection string for the error log database.
*   `RabbitMQ:Host`, `RabbitMQ:Username`, `RabbitMQ:Password`, `RabbitMQ:Port`: RabbitMQ connection details for consuming events.

## 10. Testing

To ensure the reliability and correctness of the `sb-error-monitor` microservice, a comprehensive testing strategy is recommended:

*   **Unit Tests**: Focus on individual components (entities, DTOs). With the **Rich Domain Model** and **Repository Pattern**, testing business logic within entities is more straightforward. Use frameworks like xUnit and mocking libraries like Moq.
    *   **Example**: Test `ErrorLog` entity methods (`MarkAsResolved`) for correct state transitions. Test the `ErrorConsumerService`'s ability to deserialize an `ErrorEvent` and correctly persist it to a mocked `IErrorLogRepository`.
*   **Integration Tests**: Verify interactions between the service and its external dependencies (database, RabbitMQ). Use test containers for PostgreSQL and RabbitMQ.
    *   **Example**: Publish a test `ErrorEvent` to the `error_queue` and assert that `sb-error-monitor` consumes it and stores it correctly in the database via `IErrorLogRepository`.
    *   **Example**: Test the `ErrorsController` endpoints (`GET /errors`, `PUT /errors/{id}/resolve`) to ensure they retrieve, filter, and update data correctly from the `IErrorLogRepository` (which would interact with `ErrorDbContext` in the infrastructure layer).
*   **API Tests**: Validate the behavior of the RESTful endpoints, including query parameters, request/response formats, status codes, and error handling. Tools like Postman or automated API testing frameworks can be used.

## 11. Further Development Considerations

*   **Error Aggregation and Alerting**: Implement logic to aggregate similar errors, define alerting thresholds, and integrate with notification systems (e.g., email, Slack).
*   **Dashboard Metrics**: Expose metrics (e.g., number of errors per service, error rates) for monitoring dashboards.
*   **Error Classification**: Enhance error classification beyond simple levels to categorize errors for better analysis.
*   **UI for Error Management**: Develop a simple UI to view, filter, and manage (e.g., mark as resolved) error logs.
*   **Event Contracts Library**: For better maintainability and type safety across microservices, define shared event DTOs in a dedicated NuGet package or shared library.
*   **Observability**: Integrate with distributed tracing (e.g., OpenTelemetry) and metrics (e.g., Prometheus) for better monitoring in production.
