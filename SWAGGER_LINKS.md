# Documentación de API (Swagger)

A continuación, encontrarás los enlaces directos para probar cada microservicio manualmente usando Swagger UI.

## 🚀 Enlaces de Acceso

Asegúrate de que el sistema esté corriendo (`docker-compose up -d`).

| Servicio | Puerto | URL Local | Descripción |
| :--- | :--- | :--- | :--- |
| **Api Gateway** | 8000 | N/A | Entrada principal. Redirige a los demás. |
| **Auth Service** | 8083 | [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html) | Login, Registro y JWT. |
| **Core Orchestrator** | 8080 | [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html) | Lanzar escaneos y gestionar trabajos. |
| **Vuln Analyzer** | 8081 | [http://localhost:8081/swagger/index.html](http://localhost:8081/swagger/index.html) | Analiza vulnerabilidades (interno). |
| **Error Monitor** | 8082 | [http://localhost:8082/swagger/index.html](http://localhost:8082/swagger/index.html) | Logs de errores (interno). |
| **Reporting Service** | 8084 | [http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html) | Generación de reportes. |

> **Nota:** Los servicios marcados como "interno" suelen ser llamados automáticamente por el Core, pero puedes probarlos individualmente.

## 🛠 Guía de Pruebas Manuales (Paso a Paso)

### Paso 1: Crear Usuario y Obtener Token (Auth Service)
1.  Abre el Swagger de **Auth Service**: [Link](http://localhost:8083/swagger-ui/index.html)
2.  Busca `POST /auth/register` (Controlador: Auth Controller).
    *   Clic en **Try it out**.
    *   Pega este JSON: `{"username": "admin", "password": "password123", "email": "admin@example.com", "role": "ADMIN"}`
    *   Clic en **Execute**. Deberías ver un código 200.
3.  Busca `POST /auth/login`.
    *   Clic en **Try it out**.
    *   JSON: `{"username": "admin", "password": "password123"}`
    *   Clic en **Execute**.
4.  Copia el token que aparece en la respuesta (`accessToken`: "eyJ..."). **Sin comillas**.

### Paso 2: Configurar el Core (Core Orchestrator)
1.  Abre el Swagger de **Core Orchestrator**: [Link](http://localhost:8080/swagger/index.html)
2.  Clic en el botón **Authorize** (arriba a la derecha).
3.  Escribe: `Bearer ` (espacio) seguido de tu token pegado.
    *   Ejemplo: `Bearer eyJhbGciOiJIUzI1Ni...`
4.  Clic en **Authorize** y luego **Close**.

### Paso 3: Lanzar un Escaneo
1.  Busca `POST /api/scans`.
2.  Clic en **Try it out**.
3.  JSON: `{"endpointId": "server-001", "scanType": "Full"}`
4.  Clic en **Execute**.
5.  Si todo va bien, recibirás un `jobId`.

### Paso 4: Verificar Resultados (Opcional)
*   Revisa los logs del contenedor `docker logs integration_systembreack-core-orchestrator-1`.
*   Verifica si **Reporting Service** generó un reporte accediendo a su Swagger.
