# SBOM Vulnerability Analyzer (`sb-vuln-analyzer`)

## General Description
This microservice handles security analysis logic. It receives information (likely identified artifacts or software versions) and queries vulnerability databases (CVE) to detect potential security risks.

## Architecture and Composition
Like the orchestrator, it follows a layered architecture to separate responsibilities.

### 1. Presentation Layer (`vuln.Api`)
Exposes analysis functionality via a REST API.
- **Controllers**:
    - `AnalyzeController`: Receives requests to initiate vulnerability analysis.
- **Program.cs**: Configures services, database, and Swagger.

### 2. Application Layer (`vuln.Application`)
Contains the core analysis logic.
- **Services**:
    - `AnalysisService`: Implements logic to compare components against the known vulnerabilities database.
- **Interfaces**: Contracts for repositories and services.

### 3. Domain Layer (`vuln.Domain`)
Domain entities related to vulnerabilities.
- **Entities**: Key entities likely include `CveEntry` (Common Vulnerabilities and Exposures).

### 4. Infrastructure Layer (`vuln.Infrastructure`)
Data access layer.
- **Data**: Database context `VulnDbContext`.
- **Repositories**: `CveEntryRepository` to query the CVE database.

## Key Technologies
- **.NET 8/9**: Development platform.
- **PostgreSQL**: Database engine for storing vulnerability definitions (CVEs).
- **Entity Framework Core**: ORM.

## Key Files and Justification
- `appsettings.json`: Configuration for the vulnerability database connection.
- `Dockerfile`: Definition for building the Docker image.
