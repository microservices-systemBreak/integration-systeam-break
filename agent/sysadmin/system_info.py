import platform
import psutil
import socket
import os

# ----------------- FUNCIÓN MAC ADDRESS PARA WOL -----------------

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
                    # psutil.AF_LINK es el tipo de dirección de capa 2
                    
                    # 3. Limpiar y devolver la MAC
                    mac = addr.address.replace(":", "").replace("-", "")
                    
                    if len(mac) == 12:
                        # Opcional: print(f"[NET] MAC Address encontrada en {name}: {mac}")
                        return mac
        
        return None

    except Exception as e:
        # Opcional: print(f"[ERROR] Fallo al obtener la MAC Address: {e}")
        return None

# ----------------- FUNCIONES EXISTENTES -----------------

def get_os_info():
    return {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "architecture": platform.machine(),
        "node": platform.node()
    }

def get_resources():
    # CPU
    cpu_percent = psutil.cpu_percent(interval=0.5)
    
    # RAM
    mem = psutil.virtual_memory()
    ram_info = {
        "total": mem.total,
        "available": mem.available,
        "percent": mem.percent
    }
    
    # DISK (Root)
    disk = psutil.disk_usage('/')
    disk_info = {
        "total": disk.total,
        "used": disk.used,
        "percent": disk.percent
    }

    return {
        "cpu_percent": cpu_percent,
        "ram": ram_info,
        "disk": disk_info
    }

def get_full_report():
    # 🚨 Modificamos para incluir la MAC Address
    report = {
        **get_os_info(),
        "resources": get_resources(),
        "mac_address": get_mac_address() # <-- NUEVO CAMPO
    }
    return report

# ----------------------------------------------------