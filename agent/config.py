import os
import uuid

# Configuración de conexión
SERVER_URL = "http://10.0.120.2:8000/report" # IP de tu servidor C#
PORT = 9875                                    # Puerto de escucha del agente
HEARTBEAT_INTERVAL = 10                       # Segundos

# --- Persistencia del ID ---
# Esto evita que el ID cambie si reinicias el servicio
ID_FILE = "data/agent_id.lic"

def get_agent_id():
    if os.path.exists(ID_FILE):
        with open(ID_FILE, "r") as f:
            return f.read().strip()
    else:
        new_id = str(uuid.uuid4())
        with open(ID_FILE, "w") as f:
            f.write(new_id)
        return new_id

AGENT_ID = get_agent_id()
