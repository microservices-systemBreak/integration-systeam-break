import logging
import logging.handlers
import os

# Definimos dónde se guardará el log. 
# Idealmente, en producción en Linux sería '/var/log/sb-agent.log'
# Por ahora, lo dejamos en la carpeta local para pruebas.
LOG_FILENAME = 'sb-agent.log'

def get_logger(name):
    """
    Configura y devuelve un logger para el módulo que lo solicite.
    """
    logger = logging.getLogger(name)
    
    # Si ya tiene handlers, no agregamos más (evita logs duplicados)
    if logger.hasHandlers():
        return logger
    
    logger.setLevel(logging.INFO) # Cambiar a DEBUG para ver más detalles

    # Formato: [Fecha Hora] [Nivel] [Modulo] Mensaje
    formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')

    # 1. Handler para Archivo (con rotación)
    # Guarda hasta 5MB y mantiene los últimos 3 archivos de respaldo.
    file_handler = logging.handlers.RotatingFileHandler(
        LOG_FILENAME, maxBytes=5*1024*1024, backupCount=3
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # 2. Handler para Consola (para ver lo que pasa mientras programas)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    return logger