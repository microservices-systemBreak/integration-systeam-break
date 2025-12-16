# agent/core.py

import time
import threading
import logging
import sys

# --- Importaciones de módulos del agente ---
from agent.config import HEARTBEAT_INTERVAL, SERVER_URL # Mantengo por si vuelven al push
from agent.comm.outbound import send_heartbeat, send_full_inventory # Ya no se usan
from agent.security.ids import start_ids_daemon 
from agent.api import run_api_server # ¡NUEVO! Importamos la función que inicia la API

logger = logging.getLogger("agent.core") 

# ====================================================================
# BUCLES DE EJECUCIÓN
# ====================================================================

# La función heartbeat_loop() y send_full_inventory() ahora son innecesarias 
# o deben ser redefinidas si el C# implementa esos endpoints.
# POR AHORA, LAS COMENTAMOS O ELIMINAMOS para evitar el bloqueo y el error de conexión.

# def heartbeat_loop():
#     # ... (Lógica comentada) ...
#     pass

# ====================================================================
# ARRANQUE
# ====================================================================

def start():
    """Inicia todos los módulos del agente."""
    
    logger.info("--- SB-AGENT STARTING (API MODE) ---")

    # 1. Iniciar IDS (Sniffer) en un hilo secundario
    try:
        # IDS se mantiene en su propio hilo
        threading.Thread(target=start_ids_daemon, daemon=True).start()
        logger.info("IDS Module initialized")
    except Exception as e:
        logger.error(f"Failed to start IDS module: {e}")

    # 2. Heartbeat/Inventario (Desactivados, no son necesarios en este flujo Pull)
    logger.info("Outbound communication (Heartbeat/Inventory) temporarily disabled.")

    # 3. Iniciar el Servidor API (Bloquea el hilo principal)
    # Esto es lo que mantiene vivo al contenedor y responde a las peticiones del Orquestador
    try:
        run_api_server()
    except Exception as e:
        logger.critical(f"Critical error starting API Server. Shutting down: {e}")
        sys.exit(1)