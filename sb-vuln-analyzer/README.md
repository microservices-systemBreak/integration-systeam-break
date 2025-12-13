# sb-vuln-analyzer Microservice

## Table of Contents
1.  [Overview](#1-overview)
2.  [Architecture](#2-architecture)
3.  [Project Structure](#3-project-structure)
4.  [Key Features](#4-key-features)
5.  [Requirements](#5-requirements)
6.  [Getting Started](#6-getting-started)
    *   [Local Development Setup](#local-development-setup)
    *   [Build and Run with Docker Compose](#build-and-run-with-docker-compose)
    *   [Database Migrations and Seed Data](#database-migrations-and-seed-data)
    *   [Run the Microservice Locally](#run-the-microservice-locally)
    *   [Verify with Swagger UI](#verify-with-swagger-ui)
7.  [API Endpoints](#7-api-endpoints)
8.  [Configuration](#8-configuration)
9.  [Testing](#9-testing)
10. [Further Development Considerations](#10-further-development-considerations)

---

## 1. Overview

The `sb-vuln-analyzer` microservice is a dedicated component within the SystemBreak security monitoring platform responsible for analyzing software packages for known vulnerabilities. It receives lists of packages from the `sb-core-orchestrator` and compares them against its internal CVE (Common Vulnerabilities and Exposures) database to identify potential security risks, returning a detailed analysis including overall severity.

## 2. Architecture

This microservice adheres strictly to a **Clean Architecture** pattern, reinforced with **Domain-Driven Design (DDD)** principles. Responsibilities are divided into distinct layers with a clear dependency rule: inner layers are independent of outer layers.

*   **API**: Handles HTTP requests and responses, acting as the entry point. Depends on Application and Infrastructure.
*   **Application**: Contains the business logic for vulnerability analysis. Defines interfaces for external dependencies (repositories). Depends on Domain.
*   **Domain**: Encapsulates core business entities (like CVE entries) and analysis logic. It is the innermost layer and is independent of all other layers. It now features a **Rich Domain Model** where business logic is encapsulated within entities.
*   **Infrastructure**: Provides concrete implementations for interfaces defined in the Application layer, dealing with external concerns such as data persistence (CVE database). Depends on Application and Domain.

## 3. Project Structure

The project is organized into the following directories, reflecting the Clean Architecture layers:

*   `vuln.Api/`: The entry point of the application.
    *   `Controllers/`: Contains API controllers (`AnalyzeController.cs`) that expose RESTful endpoints for vulnerability analysis.
    *   `Program.cs`: Configures the web host, dependency injection, middleware, and endpoint routing.
    *   `appsettings.json`: Application configuration settings, including connection strings.
*   `vuln.Application/`: Defines the application's use cases and orchestrates domain and infrastructure components.
    *   `Interfaces/`: Defines contracts for application services (`IAnalysisService.cs`) and data repositories (`ICveEntryRepository.cs`).
    *   `Services/`: Provides concrete implementations of application services (`AnalysisService.cs`).
    *   `DTOs/`: Data Transfer Objects (`AnalysisRequest.cs`, `VulnerabilityAnalysis.cs`, `PackageInfoDto.cs`, `Vulnerability.cs`) used for communication between layers and services.
*   `vuln.Domain/`: The heart of the business logic, independent of external concerns.
    *   `Entities/`: Core business entities (`CveEntry.cs`) now implement a **Rich Domain Model** with encapsulated business logic and protected state transitions.
*   `vuln.Infrastructure/`: Provides concrete implementations for interfaces defined in the Application layer, dealing with external systems.
    *   `Data/`: Database context (`VulnDbContext.cs`) and EF Core configurations, and concrete **Repository implementations** (`CveEntryRepository.cs`).

## 4. Key Features

*   **Package Vulnerability Analysis**: Receives a list of software packages and identifies known vulnerabilities by cross-referencing an internal CVE database.
*   **Severity Calculation**: Determines an overall severity level for the analyzed packages based on the found vulnerabilities.
*   **Detailed Vulnerability Reporting**: Provides a list of specific CVEs affecting the packages, including severity, CVSS score, and description.
*   **Database Persistence**: Stores CVE entries in a PostgreSQL database, utilizing the **Repository Pattern** for data access.
*   **Health Checks**: Exposes health endpoints for monitoring database connectivity.

## 5. Requirements

*   **.NET 9.0 SDK**: For building and running the application.
*   **Docker / Docker Compose**: For containerization and easy setup of dependencies (PostgreSQL).
*   **PostgreSQL 17+**: The primary database for storing CVE data.

## 6. Getting Started

### Local Development Setup

To ensure the `dotnet ef` tool works correctly for database migrations within your project context:

1.  **Ensure `Microsoft.EntityFrameworkCore.Tools` is referenced in `vuln.Api.csproj`**:
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

The easiest way to get the `sb-vuln-analyzer` and its dependencies (PostgreSQL) running is using Docker Compose.

1.  **Navigate to the monorepo root**:
    ```bash
    cd C:/Users/Msuthy/Desktop/Integration_systemBreack
    ```
2.  **Build and run core dependencies**:
    ```bash
    docker-compose up -d postgres
    ```
    This command will start the PostgreSQL container in detached mode.
3.  **Verify containers are running**:
    ```bash
    docker-compose ps
    ```

### Database Migrations and Seed Data

After the database container is up, you need to apply Entity Framework Core migrations to create the schema and potentially seed initial CVE data.

1.  **Open a terminal in the `sb-vuln-analyzer/vuln.Api` directory.**
    ```bash
    cd C:/Users/Msuthy/Desktop/Integration_systemBreack/sb-vuln-analyzer/vuln.Api
    ```
2.  **Apply migrations**:
    ```bash
    dotnet ef database update
    ```

    **Seed Data (Manual Example)**:
    To test the analysis, you might want to manually insert some sample CVE data into the `CveEntries` table in your `sb_vuln_db` PostgreSQL database. For example:
    ```sql
    INSERT INTO "CveEntries" ("CveId", "PackageName", "VulnerableVersionRange", "Severity", "CvssScore", "Description") VALUES
    ('CVE-2023-0286', 'openssl', '<=1.1.1t', 'High', 7.5, 'OpenSSL X.509 Email Address 4-byte Buffer Overflow'),
    ('CVE-2023-25690', 'curl', '<=7.88.1', 'Medium', 6.5, 'curl: HSTS bypass with IDN'),
    ('CVE-2023-28322', 'wget', '<=1.21.3', 'Critical', 9.8, 'wget: heap buffer overflow in WARC parsing');
    ```

### Run the Microservice Locally

1.  **In the same terminal** (in `sb-vuln-analyzer/vuln.Api`), execute the project:
    ```bash
    dotnet run
    ```
    The application will start and listen on configured URLs (e.g., `http://localhost:8081`).

### Verify with Swagger UI

1.  **Open your web browser** and navigate to the Swagger UI URL (e.g., `http://localhost:8081/swagger`).
2.  You should see the API documentation for `AnalyzeController`, confirming the service is running and exposing its endpoints.

## 7. API Endpoints

The service exposes the following RESTful API endpoints:

### Analyze Packages
*   **Endpoint**: `POST /analyze/packages`
*   **Description**: Analyzes a list of software packages for known vulnerabilities.
*   **Request Body (`application/json`)**:
    ```json
    {
      "agentId": "pc01",
      "packages": [
        {
          "name": "openssl",
          "version": "1.1.1s"
        },
        {
          "name": "curl",
          "version": "7.88.1"
        },
        {
          "name": "nginx",
          "version": "1.20.0"
        }
      ]
    }
    ```
*   **Headers**:
    *   `X-Correlation-Id`: `TEST-ANALYSIS-001` (Optional, for tracing)
*   **Responses**:
    *   `200 OK`:
        ```json
        {
          "overallSeverity": "High",
          "vulnerabilities": [
            {
              "packageName": "openssl",
              "currentVersion": "1.1.1s",
              "cveId": "CVE-2023-0286",
              "severity": "High",
              "description": "OpenSSL X.509 Email Address 4-byte Buffer Overflow",
              "cvssScore": 7.5
            }
          ]
        }
        ```
    *   `400 Bad Request`: If request body is invalid.
    *   `500 Internal Server Error`: For unexpected server-side issues.

## 8. Configuration

Key configuration settings are managed via `appsettings.json` and environment variables:

*   `ConnectionStrings:DefaultConnection`: PostgreSQL connection string for the CVE database.

## 9. Testing

To ensure the reliability and correctness of the `sb-vuln-analyzer` microservice, a comprehensive testing strategy is recommended:

*   **Unit Tests**: Focus on individual components (services, DTOs, entities) in isolation. With the **Rich Domain Model** and **Repository Pattern**, testing business logic within entities and application services is more straightforward. Use frameworks like xUnit and mocking libraries like Moq to test business logic without external dependencies.
    *   **Example**: Test `CveEntry` entity for correct state encapsulation. Test `AnalysisService.AnalyzePackagesAsync` to ensure correct vulnerability matching and severity calculation logic, mocking `ICveEntryRepository`.
*   **Integration Tests**: Verify interactions between layers and with the database. Use test containers for PostgreSQL.
    *   **Example**: Test the entire flow from `AnalyzeController` to `AnalysisService` and its interaction with `ICveEntryRepository` (which would interact with `VulnDbContext` in the infrastructure layer), including seeding test data.
*   **API Tests**: Validate the behavior of the RESTful endpoints, including request/response formats, status codes, and error handling. Tools like Postman or automated API testing frameworks can be used.

### Run Unit Tests
To verify the core analysis logic:
```bash
dotnet test tests/UnitTests/vuln.UnitTests.csproj
```


## 10. Further Development Considerations

*   **Robust Version Comparison**: The `IsVersionAffected` logic in `AnalysisService` is simplified. For production, integrate a robust version comparison library (e.g., `NuGet.Versioning`) that handles semantic versioning, complex ranges (e.g., `>1.0.0,<2.0.0`), and distribution-specific versioning schemes.
*   **CVE Data Ingestion**: Implement a mechanism to regularly ingest and update CVE data from authoritative sources (e.g., NVD, OS vendor security advisories).
*   **Caching**: Implement a caching layer (e.g., Redis) for frequently requested package analyses to improve performance and reduce database load.
*   **Advanced Severity Calculation**: Enhance the overall severity calculation to consider factors beyond just the highest individual vulnerability severity.
*   **Authentication and Authorization**: Implement security measures for API access.
*   **Observability**: Integrate with distributed tracing (e.g., OpenTelemetry) and metrics (e.g., Prometheus) for better monitoring in production.
