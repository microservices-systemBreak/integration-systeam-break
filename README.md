
# integration-systeam-break

# well, welcome to the project

## **specialized handling**

This folder contains the microservices for the SB Management application.

Each API shares the same structure for greater readability and understanding.

This is the basic structure of each API:

```bash
sb-{Named}-service/
├── src/
│   ├── API/                           # Presentation
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── Application/                   # business logic 
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── Interfaces/
│   │   └── Services/
│   ├── Domain/                        # Entitys and contracts
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   └── Events/
│   └── Infrastructure/               # Data and comunication
│       ├── Data/
│       ├── Clients/
│       └── MessageBus/
├── tests/
│   └── UnitTests/
├── Dockerfile
└── README.md
```

##  1. sb-core-orchestrator

**Responsibilities**
- Orchestration of scans and remote commands
- Communication with Python agents
- Management of scheduled jobs
- Scheduler for automatic tasks

### Principal endpoints:

**POST** /core/requests/scan-packages

Request:
```json
{
  "endpointId": "pc01",
  "scanType": "PACKAGES_FULL",
  "requestedBy": "usuario"
}
```

Response (202 Accepted):
```json
{
  "jobId": "SCAN-20251219-0001",
  "status": "ACCEPTED",
  "correlationId": "SCAN-20251219-0001"
}
```
**POST** /core/commands

Request:
```json
{
  "endpointId": "pc01",
  "action": "APPLY_SECURITY_UPDATES",
  "params": {
    "maxDurationMinutes": 30
  },
  "requestedBy": "usuario",
  "reason": "Mitigar vulnerabilidades críticas"
}
```

Response (202 Accepted):
````json
{
  "jobId": "CMD-20251219-0001",
  "status": "ACCEPTED", 
  "correlationId": "CMD-20251219-0001"
}
````

**GET** /core/endpoints/{endpointId}/status

Response:
````json
{
  "endpointId": "pc01",
  "online": true,
  "lastSeenAt": "2025-12-19T10:00:00Z",
  "lastScanAt": "2025-12-19T09:50:00Z",
  "overallSeverity": "HIGH"
}
````
<<
**Package Scan Flow**
- Receives request from Java API Gateway
- Registers job in database with status “PENDING”
- Calls Python agent to obtain list of packages
- Sends packages to sb-vuln-analyzer for analysis
- Publishes SCAN_COMPLETED event via RabbitMQ
- Updates job to “SUCCESS” or “FAILED”

**database tables**

Tabla: jobs
````sql
CREATE TABLE jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- SCAN_PACKAGES, COMMAND
    endpoint_id VARCHAR(50) NOT NULL,
    action VARCHAR(50), -- Solo para COMMAND
    status VARCHAR(20) NOT NULL, -- PENDING, RUNNING, SUCCESS, FAILED
    correlation_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    error_message TEXT,
    scheduled_at TIMESTAMP,
    schedule_type VARCHAR(20) -- MANUAL, CRON
);
````
Tabla: endpoints_state

````sql
CREATE TABLE endpoints_state (
    endpoint_id VARCHAR(50) PRIMARY KEY,
    online BOOLEAN NOT NULL DEFAULT false,
    last_seen_at TIMESTAMP,
    last_scan_at TIMESTAMP,
    last_overall_severity VARCHAR(20) -- NONE, LOW, MEDIUM, HIGH, CRITICAL
);
````

## 2. sb-vuln-analyzer

**Responsibilities**
- Package analysis vs. CVE database
- Vulnerability severity calculation
- Recent analysis cache

### Principal endpoints:

**POST** /analyze/packages

Request:
````json
{
  "agentId": "pc01",
  "packages": [
    {
      "name": "openssl",
      "version": "1.1.1l"
    },
    {
      "name": "curl", 
      "version": "7.88.1"
    }
  ]
}
````

Response:

```json
{
  "agentId": "pc01",
  "overallSeverity": "HIGH",
  "vulnerabilities": [
    {
      "packageName": "openssl",
      "currentVersion": "1.1.1l",
      "cveId": "CVE-2023-1234",
      "severity": "CRITICAL",
      "description": "Vulnerabilidad en OpenSSL...",
      "cvssScore": 9.8
    }
  ],
  "analyzedAt": "2025-12-19T10:05:00Z"
}
```

**database tables**

Tabla: cve_definitions
````sql
CREATE TABLE cve_definitions (
    id SERIAL PRIMARY KEY,
    cve_id VARCHAR(20) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    affected_versions VARCHAR(500) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    cvss_score DECIMAL(3,1),
    description TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_cve_package ON cve_definitions(package_name);
````

## 3. sb-error-monitor

Responsibilities
- Consume RabbitMQ error events
- Store errors with correlationId
- Provide endpoints for debugging

### Principal endpoints:

**GET** /errors

**Query Parameters:**
- service (optional): Filter by service
- correlationId (optional): Filter by correlationId
- fromDate (optional): Filter from date
- limit (optional): Result limit (default: 50)

Response:

````json
{
  "errors": [
    {
      "id": "ERR-001",
      "timestamp": "2025-12-19T10:00:00Z",
      "service": "sb-core-orchestrator",
      "correlationId": "SCAN-20251219-0001",
      "level": "ERROR",
      "message": "Timeout esperando respuesta del agente",
      "details": {
        "endpointId": "pc01",
        "operation": "scan-packages"
      }
    }
  ],
  "total": 1
}
````

**database tables**

Tabla: errors

````sql
CREATE TABLE errors (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    service VARCHAR(50) NOT NULL,
    correlation_id VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL, -- ERROR, WARNING, INFO
    message TEXT NOT NULL,
    stack_trace TEXT,
    details JSONB,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_errors_correlation ON errors(correlation_id);
CREATE INDEX idx_errors_service ON errors(service);
CREATE INDEX idx_errors_timestamp ON errors(timestamp);
````

## Event Contracts (RabbitMQ)

Evento: SCAN_COMPLETED

````json
{
  "eventType": "SCAN_COMPLETED",
  "jobId": "SCAN-20251219-0001",
  "endpointId": "pc01", 
  "correlationId": "SCAN-20251219-0001",
  "completedAt": "2025-12-19T10:05:00Z",
  "result": {
    "overallSeverity": "HIGH",
    "vulnerabilitiesFound": 3,
    "packagesAnalyzed": 150
  }
}
````

Evento: COMMAND_EXECUTED

````json
{
  "eventType": "COMMAND_EXECUTED", 
  "jobId": "CMD-20251219-0001",
  "endpointId": "pc01",
  "correlationId": "CMD-20251219-0001",
  "action": "APPLY_SECURITY_UPDATES",
  "status": "SUCCESS",
  "executedAt": "2025-12-19T10:10:00Z",
  "details": {
    "durationSeconds": 45,
    "packagesUpdated": 5
  }
}
````

Evento: ERROR

````json
{
  "eventType": "ERROR",
  "service": "sb-core-orchestrator",
  "correlationId": "SCAN-20251219-0001", 
  "level": "ERROR",
  "message": "Timeout esperando respuesta del agente",
  "timestamp": "2025-12-19T10:00:00Z",
  "details": {
    "endpointId": "pc01",
    "operation": "scan-packages",
    "errorCode": "TIMEOUT"
  }
}
````

## Implementation Plan

### Configure Common Dependencies

**Essential NuGet packages:**

````xml
<!-- API -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="RabbitMQ.Client" Version="6.8.1" />

<!-- Application -->
<PackageReference Include="MediatR" Version="12.2.0" />
<PackageReference Include="FluentValidation" Version="11.9.0" />

<!-- Tests -->
<PackageReference Include="xunit" Version="2.6.0" />
<PackageReference Include="Moq" Version="4.20.70" />
````
**conposition of docker file**

````dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/API/API.csproj", "src/API/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/API/API.csproj"
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
````

**Composition of Docker yml**

````yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: system_break
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  core-orchestrator:
    build: ./sb-core-orchestrator
    ports:
      - "8080:8080"
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=sb_core_db;Username=postgres;Password=password
      - RabbitMQ__Host=rabbitmq

  vuln-analyzer:
    build: ./sb-vuln-analyzer
    ports:
      - "8081:8080"
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=sb_vuln_db;Username=postgres;Password=password

  error-monitor:
    build: ./sb-error-monitor
    ports:
      - "8082:8080"
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=sb_error_db;Username=postgres;Password=password
      - RabbitMQ__Host=rabbitmq
````

## 4. Build and Run Instructions

### Prerequisites
- .NET 9.0 SDK
- Docker & Docker Compose

### Local Build (Verified)
The following commands have been verified to work locally:

```bash
# sb-core-orchestrator
dotnet build sb-core-orchestrator/sb-core-orchestrator.sln

# sb-vuln-analyzer
dotnet build sb-vuln-analyzer/vuln.analyzer.sln

# sb-error-monitor
dotnet build sb-error-monitor/error.monitor.sln
```

### Running with Docker
```bash
docker-compose up --build
```

### Running Tests
```bash
dotnet test sb-vuln-analyzer/tests/UnitTests/vuln.UnitTests.csproj
```

## Acceptance Criteria v1.0

### Minimum Viable Features

**sb-core-orchestrator**

- POST /core/requests/scan-packages responds with 202 Accepted
- POST /core/commands responds with 202 Accepted
- Jobs are recorded in the database with correlationId
- Scheduler executes scheduled jobs every 5 minutes
- Logs include correlationId

**sb-vuln-analyzer**

- POST /analyze/packages analyzes package list
- Returns vulnerabilities found
- Calculates overall severity

**sb-error-monitor**

- Consumes RabbitMQ queue messages
- Stores errors in database
- GET /errors returns list of filtered errors

### Integration Tests

* Complete Scan Flow:
  * Request from Postman → core-orchestrator
  * Job created in database
  * Call to Python agent (stub)
  * Call to vuln-analyzer
  * SCAN_COMPLETED event published

* Error Handling:
  * Agent timeout generates ERROR event
  * Error is stored in error-monitor
  * Job marked as FAILED

* Scheduler:
  * Scheduled job runs automatically
  * Generates unique correlationId for cron jobs

### Development Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sb_core_db;Username=postgres;Password=password"
  },
  "RabbitMQ": {
    "Host": "localhost",
    "Username": "guest", 
    "Password": "guest"
  },
  "Services": {
    "VulnAnalyzer": "http://localhost:8081",
    "AgentBaseUrl": "http://localhost:5000"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
``
