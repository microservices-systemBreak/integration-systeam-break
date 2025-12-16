# agent/sysadmin/attack_control.py

import requests
import json
import logging

# Configuración base del simulador. 
# Si el simulador corre en otra máquina o puerto, se debe actualizar esta URL.
SIMULATOR_BASE_URL = "http://localhost:8000"

logger = logging.getLogger(__name__)

def execute_attack_command(endpoint: str, payload: dict) -> dict:
    """
    Función genérica para enviar comandos al sb-attack-simulator.
    
    Args:
        endpoint (str): La ruta específica del ataque (ej. '/attacks/scan/syn').
        payload (dict): El cuerpo JSON de la petición (ej. target_ip, port_range).
    
    Returns:
        dict: La respuesta JSON del microservicio simulador.
    """
    full_url = SIMULATOR_BASE_URL + endpoint
    
    try:
        logger.info(f"Sending attack command to {full_url} with payload: {payload}")
        
        response = requests.post(full_url, json=payload, timeout=30)
        
        # FastAPI devuelve 200 OK en éxito, o códigos de error
        response.raise_for_status() 
        
        return response.json()
        
    except requests.exceptions.HTTPError as e:
        # Maneja errores 4xx/5xx del simulador
        logger.error(f"Attack simulator returned HTTP error {response.status_code}: {e}")
        return {"error": "Simulator HTTP Error", "details": response.text}
    except requests.exceptions.RequestException as e:
        # Maneja errores de conexión (ej. simulador no corre)
        logger.error(f"Connection error to simulator at {SIMULATOR_BASE_URL}: {e}")
        return {"error": "Connection Error", "details": str(e)}

# Funciones wrapper para los ataques
def run_syn_scan_remote(target_ip: str, port_range: str):
    payload = {"target_ip": target_ip, "port_range": port_range}
    return execute_attack_command("/attacks/scan/syn", payload)

def run_icmp_flood_remote(target_ip: str, count: int):
    payload = {"target_ip": target_ip, "count": count}
    return execute_attack_command("/attacks/flood/icmp", payload)