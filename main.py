# # main.py
# import sys
# import os

# # Asegurar que Python encuentre el paquete 'agent' si ejecutamos desde fuera
# sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# from agent.core import start

# if __name__ == "__main__":
#     try:
#         start()
#     except KeyboardInterrupt:
#         print("\n[STOP] Agent stopping by user request.")


# main.py (en la raíz de sb-agent)

import threading
import uvicorn
from agent.core import start_agent_tasks  # Asumo que tienes una función así
# Importamos la app FastAPI del nuevo módulo de simulación
from agent.simulation_server.server import app as simulation_app

def run_simulation_server():
    """Función para correr el servidor API/WebSocket para React."""
    # Usamos un puerto estándar como 8000
    uvicorn.run(simulation_app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    print("Starting sb-agent...")

    # 1. Iniciar el servidor API/WebSocket en un hilo separado
    simulation_thread = threading.Thread(target=run_simulation_server, daemon=True)
    simulation_thread.start()
    print(">>> API/WebSocket Server for React running on http://0.0.0.0:8000")
    print(">>> React should connect to this server.")

    # 2. Iniciar las tareas principales del agente (esto no cambia)
    start_agent_tasks()

    print("sb-agent core tasks running.")