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

## 🛠 Manual Testing Workflow (Step-by-Step)

### Step 1: Create User & Login (Auth Service)
1.  Open **Auth Service** Swagger: [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html)
2.  Expand **AuthController** -> `POST /auth/register`.
    *   Click **Try it out**.
    *   Enter JSON: `{"username": "testuser", "password": "password123", "email": "test@example.com", "role": "USER"}`
    *   Click **Execute**.
3.  Expand `POST /auth/login`.
    *   Click **Try it out**.
    *   Enter JSON: `{"username": "testuser", "password": "password123"}`
    *   Click **Execute**.
4.  copy the **token** string from the Response body (e.g., `eyJhbGci...`).

### Step 2: Configure System Scan (Core Orchestrator)
1.  Open **Core Orchestrator** Swagger: [http://localhost:8080/swagger](http://localhost:8080/swagger)
2.  Click the **Authorize** button (top right).
3.  In the value box, type: `Bearer ` followed by your token.
    *   Example: `Bearer eyJhbGci...`
    *   *Note: Don't forget the space after Bearer!*
4.  Click **Authorize** -> **Close**.
5.  Expand **Scan** -> `POST /api/scans`.
    *   Click **Try it out**.
    *   Enter JSON: `{"endpointId": "linux-001", "scanType": "Full"}`
    *   Click **Execute**.
6.  Note the `jobId` in the response.

### Step 3: Verify Results
*   **Vuln Analyzer**: Open [http://localhost:8081/swagger](http://localhost:8081/swagger), check logs or health.
*   **Reporting**: Open [http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html). If implemented, check `GET /reports/{jobId}`.
