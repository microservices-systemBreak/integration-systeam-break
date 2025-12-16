<#
.SYNOPSIS
    Script para crear las bases de datos necesarias en Aiven (u otro PostgreSQL remoto).
    Lee las credenciales del archivo .env y usa un contenedor Docker temporal para ejecutar los comandos.

.DESCRIPTION
    Este script es necesario porque Aiven no crea las bases de datos automáticamente.
    Debes ejecutarlo una sola vez antes de levantar el sistema.
#>

# 1. Leer variables del archivo .env
Write-Host "Leendo configuración de .env..." -ForegroundColor Cyan
$envParams = @{}
Get-Content .env | Where-Object { $_ -match '=' -and $_ -notmatch '^#' } | ForEach-Object {
    $parts = $_ -split '=', 2
    $envParams[$parts[0].Trim()] = $parts[1].Trim()
}

$DB_HOST = $envParams['DB_HOST']
$DB_PORT = $envParams['DB_PORT']
$DB_USER = $envParams['DB_USER']
$DB_PASSWORD = $envParams['DB_PASSWORD']
$SSL_MODE = $envParams['DB_SSL_MODE']

# Validar que no estemos intentar usar 'postgres' local si queremos configurar Aiven
if ($DB_HOST -eq "postgres" -or $DB_HOST -eq "localhost") {
    Write-Warning "El DB_HOST está configurado como '$DB_HOST'."
    Write-Warning "Este script está pensado para configurar Aiven remoto."
    Write-Warning "Si estás usando Docker local, el init.sql ya se encarga de esto."
    $confirmation = Read-Host "¿Deseas continuar de todas formas? (S/N)"
    if ($confirmation -ne 'S') { exit }
}

Write-Host "Conectando a PostgreSQL en $DB_HOST..." -ForegroundColor Cyan

# Lista de bases de datos a crear
$databases = @(
    $envParams['DB_NAME_AUTH'],
    $envParams['DB_NAME_CORE'],
    $envParams['DB_NAME_VULN'],
    $envParams['DB_NAME_ERROR'],
    $envParams['DB_NAME_REPORTING']
)

# 2. Ejecutar comandos usando Docker (para no requerir psql instalado localmente)
foreach ($dbName in $databases) {
    if (-not $dbName) { continue }
    
    Write-Host "Creando base de datos: $dbName ..." -NoNewline
    
    # Usamos 'postgres:17' para lanzar el comando psql
    # Nos conectamos a la DB 'defaultdb' (o 'postgres') para crear las otras
    try {
        docker run --rm `
            -e PGPASSWORD=$DB_PASSWORD `
            postgres:17 `
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d defaultdb `
            -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
        
        # Ignoramos error si ya existe (el exit code de psql será != 0 si falla, pero aqui simplificamos)
        Write-Host " [INTENTO REALIZADO]" -ForegroundColor Green
    }
    catch {
        Write-Host " [ERROR]" -ForegroundColor Red
        Write-Host $_
    }
}

Write-Host "`nProceso finalizado. Verifica en tu consola de Aiven si las bases de datos aparecen." -ForegroundColor Cyan
