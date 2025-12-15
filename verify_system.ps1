# System Break Verification Script
$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param($Name, $Url)
    Write-Host "Checking $Name ($Url)..." -NoNewline
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction Stop
        Write-Host " [OK]" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " [FAILED] - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "--- Starting System Verification ---" -ForegroundColor Cyan

# 1. Health Checks
$gatewayUp = Test-Endpoint "API Gateway Health" "http://localhost:8000/actuator/health"
$authUp = Test-Endpoint "Auth Service Health" "http://localhost:8080/actuator/health"
$coreUp = Test-Endpoint "Core Orchestrator Swagger" "http://localhost:5001/swagger/index.html" # Puerto C#

if (-not ($gatewayUp -and $authUp -and $coreUp)) {
    Write-Host "❌ Critical services are down. Aborting functional tests." -ForegroundColor Red
    exit 1
}

# 2. Functional Test: Auth
Write-Host "`n--- Testing Authentication ---" -ForegroundColor Cyan
$user = @{
    email = "testrunner@example.com"
    password = "StrongPassword123!"
    firstName = "Test"
    lastName = "Runner"
    username = "testrunner" # Adding username just in case
}

$registerUrl = "http://localhost:8000/auth/register" # A través del Gateway
# Try registering (ignore if already exists)
try {
    Write-Host "Registering user..."
    $regResponse = Invoke-RestMethod -Uri $registerUrl -Method Post -Body ($user | ConvertTo-Json) -ContentType "application/json"
    Write-Host "User registered." -ForegroundColor Green
} catch {
    Write-Host "User registration skipped or failed (might already exist)." -ForegroundColor Yellow
}

# Login
$loginUrl = "http://localhost:8000/auth/login" # A través del Gateway
$loginBody = @{
    email = "testrunner@example.com" # Some implementations use email
    username = "testrunner@example.com" # Some use username, trying email as username if needed
    password = "StrongPassword123!"
}

try {
    Write-Host "Attempting Login..."
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body ($loginBody | ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.access_token
    if ($null -eq $token) { throw "No token in response" }
    Write-Host "✅ Login Successful! Token received." -ForegroundColor Green
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    # Try alternate login body if username is required instead of email
    try {
         $loginBody2 = @{ username = "testrunner"; password = "StrongPassword123!" }
         $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body ($loginBody2 | ConvertTo-Json) -ContentType "application/json"
         $token = $loginResponse.access_token
         Write-Host "✅ Login Successful (Retry with username)! Token received." -ForegroundColor Green
    } catch {
        Write-Host "❌ Login Failed Again. Aborting." -ForegroundColor Red
        exit 1
    }
}

# 3. Functional Test: Create Scan
Write-Host "`n--- Testing Core Logic (Create Scan) ---" -ForegroundColor Cyan
$scanUrl = "http://localhost:8000/core/requests/scan-packages" # Ruta correcta a través del Gateway
$scanBody = @{
    targetUrl = "https://example.com"
    scanType = "FULL"
}

try {
    $scanHeader = @{ Authorization = "Bearer $token" }
    $scanResponse = Invoke-RestMethod -Uri $scanUrl -Method Post -Body ($scanBody | ConvertTo-Json) -ContentType "application/json" -Headers $scanHeader
    Write-Host "✅ Scan Created! ID: $($scanResponse.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Create Scan Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check if Core Orchestrator is connected to DB and RabbitMQ."
}

Write-Host "`n--- Verification Complete ---" -ForegroundColor Cyan
