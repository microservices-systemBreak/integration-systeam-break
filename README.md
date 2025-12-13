# 🐍 SB Agent (System Break Agent)

El SB Agent es un microservicio ligero implementado en Python con FastAPI, diseñado para ejecutarse en máquinas host (Linux) como un servicio de `systemd` con privilegios de `root`. Su principal responsabilidad es interactuar con el sistema operativo (OS) para reportar el estado y ejecutar comandos remotos solicitados por el `sb-core-orchestrator`.

---

## 🏗️ Arquitectura y Dependencias

Este Agente se basa en librerías estándar de Python para la interacción con el sistema y utiliza FastAPI para la capa de comunicación API.

### Dependencias de Python

Para ejecutar este proyecto, es necesario instalar las siguientes librerías:

```bash
pip install fastapi uvicorn psutil
````

| Librería | Propósito |
| :--- | :--- |
| `fastapi` | Creación de la API (Servidor HTTP). |
| `uvicorn` | Servidor ASGI para servir la aplicación FastAPI. |
| `psutil` | Acceso a métricas del sistema (CPU, RAM, MAC Address, etc.). |

### Dependencias del Sistema Operativo (Host)

El Agente asume la presencia de las siguientes herramientas en el sistema Host (ej. Ubuntu/Debian):

  * **`python3`** y **`pip`**
  * **`systemd`** (para gestionar el servicio)
  * **`apt`** (para la función de `update`)
  * **`xdg-open`** (para la función `show_video`)

-----

## 🚀 Instalación y Despliegue

El despliegue del Agente se realiza configurándolo como un servicio de `systemd` para asegurar que se ejecute al inicio del sistema y con los permisos necesarios.

### 1\. Configuración de Entorno

1.  Clonar el repositorio y crear un entorno virtual:
    ```bash
    git clone [REPO_URL] sb-agent
    cd sb-agent
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt # O las dependencias listadas arriba
    ```
2.  Desactivar el entorno virtual cuando esté listo: `deactivate`

### 2\. Creación del Servicio `systemd`

Crear el archivo de unidad del servicio, típicamente en `/etc/systemd/system/sb-agent.service`.

```ini
# /etc/systemd/system/sb-agent.service
[Unit]
Description=SB Agent - Remote Management Service
After=network.target

[Service]
User=root # Ejecutar como root para permisos de shutdown, apt y GUI
Group=root
WorkingDirectory=/home/coders/Escritorio/sb-agent 
# Asegúrate de que esta ruta sea la correcta para tu proyecto
ExecStart=/home/coders/Escritorio/sb-agent/venv/bin/python3 /home/coders/Escritorio/sb-agent/agent/api.py
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### 3\. Habilitar y Ejecutar el Servicio

1.  Recargar la configuración de `systemd`:
    ```bash
    sudo systemctl daemon-reload
    ```
2.  Habilitar el servicio para que se inicie al arrancar:
    ```bash
    sudo systemctl enable sb-agent.service
    ```
3.  Iniciar el servicio:
    ```bash
    sudo systemctl start sb-agent.service
    ```
4.  Verificar el estado y los logs:
    ```bash
    sudo systemctl status sb-agent.service
    sudo journalctl -u sb-agent.service -f
    ```

-----

## ⚙️ Endpoints de la API

El Agente expone una API REST para la comunicación con el `sb-core-orchestrator` en el puerto `9875`.

| Categoría | Método | Endpoint | Descripción | Requerido |
| :--- | :--- | :--- | :--- | :--- |
| **I. Estado y WOL** | `GET` | `/agent/status` | **Heartbeat & MAC:** Reporta métricas (CPU, RAM) y la `macAddress` (crucial para WOL). | Ninguno |
| **II. Gestión de Energía** | `POST`| `/sysadmin/shutdown`| **Apagado:** Ejecuta el apagado inmediato del Host. | Ninguno |
| **III. Gestión del Sistema** | `POST`| `/sysadmin/update` | **Actualización:** Ejecuta `apt update -y && apt upgrade -y`. | Ninguno |
| **IV. Control Multimedia**| `POST`| `/sysadmin/multimedia/video` | **Mostrar Video:** Abre un archivo de video en la sesión gráfica activa. | `{ "path": "ruta/local" }` |



-----

## 📋 Resumen de Endpoints del SB Agent (FastAPI)

El Agente escucha en el puerto `9875`. La URL base para las pruebas locales es `http://localhost:9875`.

### I. Estado y WOL (Heartbeat)

Este *endpoint* es la base del *heartbeat* y la recolección de datos, incluyendo la **MAC Address** esencial para Wake-on-LAN (WOL).

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `GET` |
| **Ruta** | `/agent/status` |
| **Función** | `get_agent_status()` |
| **Estado** | ✅ Validado |

**Respuesta JSON (Código 200 OK):**

```json
{
  "agentId": "f93943f8-6763-475b-9614-309768bbbb32",
  "online": true,
  "cpuLoad": 0.3,          
  "ramUsagePercent": 0.0,  
  "osName": "Linux",       
  "lastSeenAt": "2025-12-13T17:50:00.902983Z",
  "overallSeverity": "NONE",
  "macAddress": "08bfb8031373" 
}
```

-----

### II. Gestión de Energía (Apagado)

Permite al Orchestrator apagar la máquina Host remotamente.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `POST` |
| **Ruta** | `/sysadmin/shutdown` |
| **Función** | `shutdown()` |
| **Body** | Ninguno (`{}`) |
| **Estado** | ✅ Validado |

**Respuesta JSON (Código 200 OK):**

```json
{
  "status": "success",
  "message": "Host shutdown command executed."
}
```

-----

### III. Gestión del Sistema (Actualización)

Permite al Orchestrator ejecutar las actualizaciones de seguridad y paquetes.

| Detalle | Especificación |
| :--- | :--- |
| **Método** | `POST` |
| **Ruta** | `/sysadmin/update` |
| **Función** | `update_system()` |
| **Body** | Ninguno (`{}`) |
| **Estado** | ✅ Validado |

**Respuesta JSON (Código 200 OK):**

```json
{
  "status": "success",
  "message": "System update initiated."
}
```

-----

## 💡 Consideraciones de Seguridad y GUI

### Interacción Gráfica (`show_video`)

Debido a que el Agente corre como `root` bajo `systemd` y las aplicaciones gráficas corren bajo la sesión del usuario (`coders` en el host), se realiza un esfuerzo para inyectar las variables de entorno `DISPLAY` y `XAUTHORITY` necesarias para interactuar con la GUI.

El comando principal utilizado es `subprocess.Popen(["xdg-open", path], env=env)`. Si la función `show_video` falla, es probable que la configuración de `DISPLAY` o `XAUTHORITY` deba ajustarse al entorno específico del host.

### Permisos

El Agente requiere ejecutarse como `root` para:

1.  Ejecutar el comando de apagado (`systemctl poweroff`).
2.  Ejecutar los comandos de actualización (`apt`).
3.  Interactuar con la sesión gráfica del usuario.

<!-- end list -->
