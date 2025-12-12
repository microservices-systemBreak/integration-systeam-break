# agent/api.py (MODIFICADO)
import uvicorn
from fastapi import FastAPI
import logging
from datetime import datetime, timezone # Necesario para la marca de tiempo

# --- Importaciones del agente ---
from agent.config import AGENT_ID, PORT
from agent.sysadmin.packages import list_installed_packages
# Asumo que get_resources está en system_info.py y debes importarla aquí:
from agent.sysadmin.system_info import get_resources 

logger = logging.getLogger("agent.api")

# Crea la aplicación FastAPI
app = FastAPI(title="SB Agent API")

@app.get("/agent/packages", tags=["Scan"])
async def get_packages_for_analysis():
    
    packages_list = list_installed_packages()
    
    response = {
        "agentId": AGENT_ID, 
        "packages": packages_list 
    }
    
    logger.info(f"Returning {len(packages_list)} packages for analysis.")
    return response

# ======================================================================
# NUEVO ENDPOINT PARA ESTADO (RAM/CPU)
# ======================================================================
@app.get("/agent/status", tags=["Status"])
async def get_agent_status():
    """
    Endpoint llamado por el sb-core-orchestrator para obtener el estado 
    actual del sistema (CPU, RAM) y actualizar la interfaz de usuario.
    """
    logger.info("Received request for agent status.")
    
    # Obtener recursos (CPU, RAM, Disco)
    resources = get_resources()
    
    # Obtener la marca de tiempo actual en formato ISO 8601 (UTC)
    current_time = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    
    # El Orquestador C# usará esto para actualizar la tabla endpoints_state 
    # y la interfaz de usuario (como la imagen que mostraste).
    response = {
        "agentId": AGENT_ID,
        "online": True, # Si el Agente responde, está Online.
        "cpuLoad": resources.get('cpu_percent', 0.0),
        "ramUsagePercent": resources.get('ram_percent', 0.0),
        # Se puede añadir más campos como:
        "osName": resources.get('os_name', 'Unknown'),
        "lastSeenAt": current_time,
        "overallSeverity": "NONE" # Por defecto, sin escaneo de vulnerabilidades
    }
    
    logger.info("Returning real-time status data.")
    return response

# Función principal para ejecutar el servidor
def run_api_server():
    """Inicia el servidor Uvicorn para la API."""
    logger.info(f"Starting API listener on port {PORT}...")
    # ... (El código de uvicorn.run se mantiene sin cambios) ...
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=PORT
    )