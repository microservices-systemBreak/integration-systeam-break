# System Overview (SBOM System)

This document describes the general architecture and interaction between the microservices that make up the Vulnerability Analysis and Monitoring System (SBOM).

## Logic Architecture Diagram

```mermaid
graph TD
    User[User / API Client] -->|HTTP REST| Orchestrator[sb-core-orchestrator]
    Orchestrator -->|HTTP| VulnAnalyzer[sb-vuln-analyzer]
    Orchestrator -->|AMQP (Events)| MQ((RabbitMQ))
    MQ -->|Consumes ErrorEvent| ErrorMonitor[sb-error-monitor]
    Agent[Endpoint Agent] -->|HTTP| Orchestrator
```

## Microservices and Components

The system is composed of three main services and a shared library:

1.  **`sb-core-orchestrator`**:
    *   **Role**: System Brain.
    *   **Responsibility**: Manage endpoints, schedule and execute scans, and coordinate actions.
    *   **Interactions**: Calls `sb-vuln-analyzer` to analyze results and publishes events to RabbitMQ.

2.  **`sb-vuln-analyzer`**:
    *   **Role**: Analysis Engine.
    *   **Responsibility**: Detect vulnerabilities (CVEs) based on provided data.
    *   **Interactions**: Receives requests from the orchestrator. Queries its own database of vulnerability definitions.

3.  **`sb-error-monitor`**:
    *   **Role**: Observability and Monitoring.
    *   **Responsibility**: Capture and store errors occurring anywhere in the distributed system.
    *   **Interactions**: Passively listens to the message queue in RabbitMQ for error events.

4.  **`sb.Shared`**:
    *   **Role**: Communication Contract.
    *   **Responsibility**: Defines events (`CommandExecuted`, `ErrorEvent`, `ScanCompleted`) that enable decoupled communication between services.

## Main Workflows

### 1. Vulnerability Scan
1.  The user schedules a scan in `sb-core-orchestrator`.
2.  The orchestrator sends commands to the Agent (on the endpoint).
3.  The Agent returns results (installed software list, etc.).
4.  The orchestrator sends this data to `sb-vuln-analyzer`.
5.  `sb-vuln-analyzer` responds with detected vulnerabilities.
6.  The orchestrator saves the results and publishes a `ScanCompletedEvent`.

### 2. Error Management
1.  If a failure occurs in `sb-core-orchestrator` (e.g., connection failure with the agent), an `ErrorEvent` is published to RabbitMQ.
2.  `sb-error-monitor` consumes this event and saves it to its database.
3.  Administrators can query `sb-error-monitor` to view the failure history.

## Project Structure
All services follow **Clean Architecture**, ensuring domain logic is independent of frameworks and infrastructure details.
