$services = @(
    @{ Name="Gateway"; Url="http://localhost:8000/actuator/health"; Port=8000 },
    @{ Name="Core Orchestrator"; Url="http://localhost:8080/health"; Port=8080 },
    @{ Name="Vuln Analyzer"; Url="http://localhost:8081/health"; Port=8081 },
    @{ Name="Error Monitor"; Url="http://localhost:8082/health"; Port=8082 },
    @{ Name="Auth Service"; Url="http://localhost:8083/actuator/health"; Port=8083 },
    @{ Name="Reporting Service"; Url="http://localhost:8084/actuator/health"; Port=8084 }
)

Write-Host "--- SYSTEM STATUS CHECK (Time: $(Get-Date)) ---" -ForegroundColor Cyan

foreach ($svc in $services) {
    try {
        $conn = Test-NetConnection -ComputerName localhost -Port $svc.Port -WarningAction SilentlyContinue
        if ($conn.TcpTestSucceeded) {
            Write-Host "[$($svc.Name)] PORT $($svc.Port) : OPEN" -ForegroundColor Green -NoNewline
            try {
                $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
                Write-Host " | HTTP $($response.StatusCode)" -ForegroundColor Green
            } catch {
                Write-Host " | HTTP CHECK FAILED: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "[$($svc.Name)] PORT $($svc.Port) : CLOSED (Service not running)" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error checking $($svc.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}
