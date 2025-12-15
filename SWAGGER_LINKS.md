# Swagger API Documentation

This guide lists the Swagger UI endpoints for manually testing the microservices.

## 🚀 Accessing Swagger UI

Once the system is running (`docker-compose up -d`), you can access the following documentation endpoints:

| Service | Port | Local URL | Description |
| :--- | :--- | :--- | :--- |
| **Core Orchestrator** | 8080 | [http://localhost:8080/swagger](http://localhost:8080/swagger) | Manages scans, jobs, and orchestration logic. |
| **Vuln Analyzer** | 8081 | [http://localhost:8081/swagger](http://localhost:8081/swagger) | Analyzes package lists for vulnerabilities. |
| **Error Monitor** | 8082 | [http://localhost:8082/swagger](http://localhost:8082/swagger) | (Optional) Logs system errors. |
| **Auth Service** | 8083 | [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html) | Manages Users, JWT Tokens, and Authorization. |
| **Reporting Service** | 8084 | [http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html) | (If enabled) Generates PDF/JSON reports. |

> **Note**: For Java services (Auth, Reporting), the path is typically `/swagger-ui/index.html`. For C# services, it is `/swagger`.

## 🛠 Manual Testing Workflow

1.  **Authentication**:
    *   Go to **Auth Service** Swagger.
    *   Use `/auth/register` to create a user.
    *   Use `/auth/login` to get a `Bearer Token`.

2.  **Core Operations**:
    *   Go to **Core Orchestrator** Swagger.
    *   Authorize using the Bearer Token.
    *   Use `POST /api/scans` to initiate a scan for an endpoint.

3.  **Verification**:
    *   Check **Vuln Analyzer** logs or Swagger to see analysis requests.
    *   Check **Reporting Service** logs for report generation.
