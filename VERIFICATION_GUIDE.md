# Guía de Verificación Completa: System Break

¡Felicidades! La aplicación ha levantado correctamente. Ahora vamos a verificar que todos los "órganos" del sistema estén vivos y conectados.

## 🟢 Paso 1: Verificación de Salud (Health Checks)

Abre estas URLs en tu navegador para confirmar que cada servicio está respondiendo:

### Servicios Java (Infraestructura & Auth)
*   **API Gateway**: [http://localhost:8000/actuator/health](http://localhost:8000/actuator/health) (Debe decir `{"status":"UP"}`)
*   **Auth Service**: [http://localhost:8083/actuator/health](http://localhost:8083/actuator/health)
*   **Reporting Service**: [http://localhost:8084/actuator/health](http://localhost:8084/actuator/health)

### Servicios C# (Core Logic)
*   **Core Orchestrator (Swagger)**: [http://localhost:8080/swagger](http://localhost:8080/swagger)
*   **Vuln Analyzer (Swagger)**: [http://localhost:8081/swagger](http://localhost:8081/swagger)
*   **Error Monitor (Swagger)**: [http://localhost:8082/swagger](http://localhost:8082/swagger)

---

## 🔄 Paso 2: Prueba de Flujo Funcional (End-to-End)

Vamos a simular el uso real del sistema usando **Swagger** o **Postman**.

### 1. Autenticación (Obtener Token)
*Necesitamos un token para interactuar con el sistema.*
1.  Ve a **Auth Service** (o úsalo vía Gateway).
2.  Endpoint: `POST /auth/register` (crea un usuario `admin`/`123456`).
3.  Endpoint: `POST /auth/login`.
4.  **Copia el "access_token"** de la respuesta.

### 2. Registrar un Escaneo (Core Orchestrator)
1.  Ve a **Core Orchestrator Swagger**: [http://localhost:8080/swagger](http://localhost:8080/swagger).
2.  Busca `POST /api/scans` (o endpoint similar según la documentación).
3.  Usa el botón **Authorize** (arriba a la derecha) y pega tu token: `Bearer <tu_token>`.
4.  Ejecuta el request:
    ```json
    {
      "targetUrl": "https://example.com",
      "scanType": "FULL"
    }
    ```
5.  **Resultado Esperado**: Código `201 Created` o `202 Accepted` y un `scanId`.

### 3. Verificar Análisis (Vuln Analyzer)
1.  Ve a **Vuln Analyzer Swagger**: [http://localhost:8081/swagger](http://localhost:8081/swagger).
2.  Deberías ver logs en la consola de Docker indicando que recibió el evento de escaneo.
3.  (Opcional) Consulta `GET /api/vulnerabilities/{scanId}` si existe.

### 4. Generar Reporte (Reporting Service)
1.  Ve al **Reporting Service** (vía Gateway `http://localhost:8000/reports` o puerto directo `8084`).
2.  Solicita el reporte del `scanId` generado en el paso 2.

### 5. Verificar Errores (Error Monitor)
1.  Ve a **Error Monitor Swagger**: [http://localhost:8082/swagger](http://localhost:8082/swagger).
2.  Consulta `GET /api/errors`.
3.  Si todo salió bien, **¡NO deberías ver nuevos errores!** (o solo info logs).

---

## 🛠️ Comandos Útiles

**Ver logs en tiempo real:**
```powershell
# Ver todos los logs mezclados
docker-compose logs -f

# Ver logs de un servicio específico (ej. Gateway) para depurar rutas
docker-compose logs -f sb-api-gateway
```

**Reiniciar un solo servicio (si se pega):**
```powershell
docker-compose restart core-orchestrator
```
