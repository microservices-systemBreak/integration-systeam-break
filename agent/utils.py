import logging
import logging.handlers
import os
import psutil # <--- NUEVA IMPORTACIÓN

# Definimos dónde se guardará el log. 
LOG_FILENAME = 'sb-agent.log'

# Logger para este módulo
mac_logger = logging.getLogger('MAC_UTILS')

# --- FUNCIÓN DE MAC ADDRESS ---
def get_mac_address():
    """
    Obtiene la MAC Address de la primera interfaz física activa 
    y la devuelve en formato sin separadores (ej: 001122334455).
    """
    try:
        addresses = psutil.net_if_addrs()
        
        for name, addrs in addresses.items():
            # 1. Ignorar interfaces de loopback y virtuales (lo, docker, veth, etc.)
            if name.startswith(('lo', 'docker', 'veth', 'virbr')):
                continue

            # 2. Buscar la dirección física (MAC)
            for addr in addrs:
                if addr.family == psutil.AF_LINK:
                    # Formatear la MAC: eliminar dos puntos o guiones
                    mac = addr.address.replace(":", "").replace("-", "")
                    
                    if len(mac) == 12:
                        mac_logger.info(f"MAC Address encontrada en {name}: {mac}")
                        return mac
        
        mac_logger.warning("No se encontró una MAC Address válida para WOL.")
        return None

    except Exception as e:
        mac_logger.error(f"Fallo al obtener la MAC Address: {e}")
        return None

# --- FUNCIÓN DE LOGGER EXISTENTE ---
def get_logger(name):
    """
    Configura y devuelve un logger para el módulo que lo solicite.
    """
    # ... (el resto de tu función get_logger permanece igual)
    logger = logging.getLogger(name)
    # ... (resto de la configuración del logger)
    return logger