# Guía de Configuración y Ejecución: Microservicios C# (.NET 9)

Esta guía detalla los pasos para configurar, compilar y ejecutar los microservicios C# del proyecto **Integration System Break** en un entorno local de desarrollo.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1.  **SDK de .NET 9.0**: [Descargar aquí](https://dotnet.microsoft.com/download/dotnet/9.0)
2.  **Base de Datos PostgreSQL** (v15 o superior):
    *   Puede estar instalada localmente o corriendo en Docker (`docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`).
3.  **RabbitMQ** (con Plugin Management):
    *   Necesario para la comunicación asíncrona.
    *   Local o Docker: `docker run -p 5672:5672 -p 15672:15672 rabbitmq:3-management`.

---

## ⚙️ Configuración del Entorno

Cada microservicio necesita conectarse a la base de datos y al bus de mensajes.

### 1. Connection Strings
Asegúrate de que tu base de datos PostgreSQL tenga las siguientes bases de datos creadas (o deja que Entity Framework las cree):
*   `sb_core_db`
*   `sb_vuln_db`
*   `sb_error_db`

### 2. Configuración por Servicio (`appsettings.json`)

Edita el archivo `appsettings.json` en la carpeta `src/API` de cada servicio si tus credenciales son diferentes a las predeterminadas (`postgres`/`password`).

**Ejemplo de configuración típica:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=sb_core_db;Username=postgres;Password=password"
},
"RabbitMQ": {
  "Host": "localhost",
  "Username": "guest",
  "Password": "guest"
}
```

---

## 🚀 Cómo Levantar los Servicios (Paso a Paso)

Debes ejecutar cada servicio en **una terminal separada** para ver los logs en tiempo real.

### Servicio 1: Core Orchestrator
El corazón del sistema.
*   **Puerto:** `8080`
*   **Directorio:** `sb-core-orchestrator`

```powershell
cd sb-core-orchestrator/core.Api
dotnet run
```
> URL Swagger: [http://localhost:8080/swagger](http://localhost:8080/swagger)

### Servicio 2: Vulnerability Analyzer
Analiza paquetes buscando CVEs.
*   **Puerto:** `8081`
*   **Directorio:** `sb-vuln-analyzer`

```powershell
cd sb-vuln-analyzer/vuln.Api
dotnet run --urls="http://localhost:8081"
```
> URL Swagger: [http://localhost:8081/swagger](http://localhost:8081/swagger)

### Servicio 3: Error Monitor
Recibe y registra errores del sistema.
*   **Puerto:** `8082`
*   **Directorio:** `sb-error-monitor`

```powershell
cd sb-error-monitor/error.Api
dotnet run --urls="http://localhost:8082"
```
> URL Swagger: [http://localhost:8082/swagger](http://localhost:8082/swagger)

---

## 🛠️ Comandos de Mantenimiento

### Actualizar Migraciones de Base de Datos
Si hay cambios en el modelo de datos, ejecuta esto dentro de la carpeta del microservicio correspondiente:

```powershell
# Instalar herramienta EF Core (solo la primera vez)
dotnet tool install --global dotnet-ef

# Aplicar migraciones (ejemplo para Core Orchestrator)
cd sb-core-orchestrator
dotnet ef database update --project core.Infrastructure --startup-project core.Api
```

### Ejecutar Tests Unitarios
Para verificar que la lógica interna funciona correctamente:

```powershell
dotnet test
```

---

## ⚠️ Solución de Problemas Comunes

1.  **Error "Host desconocido" o conexión rechazada a PostgreSQL/RabbitMQ**:
    *   Verifica que los servicios base (DB y RabbitMQ) estén arriba antes de iniciar los microservicios.
    *   Revisa el `DefaultConnection` en `appsettings.json`.

2.  **Puerto ocupado**:
    *   Si el puerto 8080 está en uso, puedes cambiarlo en el comando `dotnet run --urls="http://localhost:XXXX"`.

3.  **Error de dependencias (NuGet)**:
    *   Ejecuta `dotnet restore` en la carpeta raíz de la solución para descargar paquetes faltantes.
