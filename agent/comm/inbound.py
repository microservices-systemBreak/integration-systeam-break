import socket
import threading
import json
from agent.sysadmin import executor
from agent.config import PORT
from agent.utils import get_logger

# Iniciamos logger para este módulo
logger = get_logger("INBOUND")

ACTIONS = {
    "shutdown": executor.shutdown,
    "upgrade": executor.update_system,
    "show_video": executor.show_video,
    "set_wallpaper": executor.change_wallpaper,
}

def handle(conn, addr):
    logger.info(f"Connection established from {addr}")
    try:
        raw = conn.recv(4096).decode().strip()
        if not raw: return

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON received from {addr}: {raw}")
            return

        action_name = data.get("action")
        args = data.get("args", {})

        if action_name in ACTIONS:
            logger.info(f"Executing command: '{action_name}' with args: {args}")
            try:
                ACTIONS[action_name](args)
                logger.info(f"Command '{action_name}' executed successfully")
            except Exception as e:
                logger.error(f"Error executing '{action_name}': {e}", exc_info=True)
        else:
            logger.warning(f"Unknown action requested: {action_name}")

    except Exception as e:
        logger.error(f"Handler error with {addr}: {e}")
    finally:
        conn.close()

def listen():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        s.bind(("0.0.0.0", PORT))
        s.listen(5)
        logger.info(f"Listener running on port {PORT}")

        while True:
            conn, addr = s.accept()
            threading.Thread(target=handle, args=(conn, addr), daemon=True).start()
    except Exception as e:
        logger.critical(f"Cannot bind port {PORT}. Is it already in use? Error: {e}")
        # Aquí sí podríamos querer cerrar el programa si no podemos escuchar
        raise