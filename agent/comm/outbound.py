import socket
import requests
import time
import logging

# Usaremos logging en lugar de print para mejor manejo en Docker
logger = logging.getLogger("agent.comm.outbound")

# --- Importaciones de otros módulos del agente ---
from agent.config import AGENT_ID, SERVER_URL # Asumo que SERVER_URL está en config.py
from agent.security.netstats import is_in_lan, is_online
from agent.sysadmin.system_info import get_resources

# Configuración
TIMEOUT_SECONDS = 5 # Timeout corto para Heartbeat/Requests

def get_base_payload():
    hostname = socket.gethostname()
    try:
        # Nota: En Docker con network_mode: host, esto debe devolver la IP real del host.
        ip = socket.gethostbyname(hostname)
    except Exception:
        ip = "127.0.0.1"

    return {
        "agent_id": AGENT_ID,
        "hostname": hostname,
        "ip": ip,
        "timestamp": int(time.time())
    }

def send_heartbeat():
    """Envía un paquete pequeño de Heartbeat con estadísticas básicas."""
    
    payload = get_base_payload()
    
    # Agregamos datos de recursos (CPU/RAM)
    payload["stats"] = get_resources() 
    payload["type"] = "heartbeat"

    try:
        # IMPORTANTE: Usamos el timeout explícito y registramos éxito/fracaso
        requests.post(SERVER_URL, json=payload, timeout=TIMEOUT_SECONDS)
        logger.info("Heartbeat sent successfully.")
    except requests.exceptions.Timeout:
        logger.error(f"Heartbeat failed: Request timed out after {TIMEOUT_SECONDS}s.")
    except requests.exceptions.RequestException as e:
        # Esto captura errores de conexión (No route to host, conexión rechazada, DNS, etc.)
        logger.error(f"Heartbeat failed: Connection error: {e}")
    except Exception as e:
        # Captura cualquier otro error inesperado
        logger.critical(f"Heartbeat failed due to unexpected error: {e}")

def send_full_inventory():
    """Envía el inventario completo (SO, paquetes, etc.)."""
    
    # Importaciones locales para evitar bucles circulares si otros módulos dependen de outbound
    from agent.sysadmin.packages import list_installed_packages
    from agent.sysadmin.system_info import get_os_info
    
    logger.info("Sending full inventory...")

    payload = get_base_payload()
    payload["type"] = "inventory"
    
    try:
        # Estas llamadas pueden tardar mucho, pero deben ser robustas
        payload["os_info"] = get_os_info()
        payload["packages"] = list_installed_packages()
        
        # Usamos un timeout más largo para el inventario, ya que el payload es grande
        requests.post(SERVER_URL, json=payload, timeout=20) 
        logger.info("Inventory sent successfully.")
    except requests.exceptions.Timeout:
        logger.error("Inventory send failed: Request timed out after 20s.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Inventory send failed: Connection error: {e}")
    except Exception as e:
        logger.critical(f"Inventory send failed due to unexpected error: {e}")


def notify_orchestrator_of_attack(attack_type, source_ip):
    """
    Notifies the main C# orchestrator about a detected security threat.
    """
    logger.warning(f"Notifying C# orchestrator of attack: {attack_type} from {source_ip}")

    payload = get_base_payload()
    payload["type"] = "security_alert"
    payload["alert"] = {
        "attack_type": attack_type,
        "source_ip": source_ip
    }

    try:
        # La URL debe apuntar a un nuevo endpoint en tu orquestador de C#
        # Ejemplo: ORCHESTRATOR_URL = "http://<IP_ORQUESTADOR>/api/security"
        alert_url = f"{ORCHESTRATOR_URL}/security/threat"
        
        # Envías los detalles del ataque al orquestador
        requests.post(alert_url, json=payload, timeout=TIMEOUT_SECONDS)
        
        logger.info("Orchestrator notified successfully.")
    except Exception as e:
        logger.error(f"Failed to notify orchestrator: {e}")