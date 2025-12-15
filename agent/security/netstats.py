# agent/security/netstats.py

import socket

def is_online():
    """
    Chequea si hay conectividad a Internet.
    """
    try:
        # Intenta resolver un host conocido de DNS
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        pass
    return False

def is_in_lan(): # <--- ASEGÚRATE DE QUE ESTA FUNCIÓN EXISTA
    """
    Devuelve True si el agente parece estar en una red local (por ejemplo, 
    verificando si su IP no es una IP pública).
    """
    # Esta es una implementación simplificada para fines de prototipo.
    # En entornos reales, se usaría 'ipaddress' para verificar rangos RFC 1918 (10.x.x.x, 192.168.x.x, etc.)
    try:
        # Obtenemos la IP local. Si es una IP privada, asumimos LAN.
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        
        # Comprobación simple para el rango 192.168.x.x (el más común)
        return local_ip.startswith('192.168.') or local_ip.startswith('10.')
    except:
        return False # Si falla, asumimos que no hay conectividad LAN detectable

# NOTA: Asegúrate de que ambas funciones estén definidas al mismo nivel.