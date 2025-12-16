# agent/simulation_server/server.py

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from typing import List
from fastapi import WebSocket, WebSocketDisconnect

# --- Lógica del Gestor de Conexiones WebSocket ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# --- Creación de la App FastAPI ---
app = FastAPI()

# --- Configuración de Rutas de Archivos ---
# Apuntamos a la carpeta `frontend` que está en la raíz del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "frontend/static")), name="static")

# --- Endpoint WebSocket ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Mantenemos la conexión abierta para recibir mensajes si fuera necesario
            # o simplemente para mantenerla viva.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- API para que React obtenga la lista de equipos ---
@app.get("/api/equipos", response_class=JSONResponse)
def get_equipos_api():
    # NOTA: Para la demo, devolvemos datos falsos.
    # Esto simplifica enormemente la demo, ya que no depende de otros servicios.
    return [
        {"id": 1, "hostname": "PC-SALA-01", "ip": "192.168.1.50"},
        {"id": 2, "hostname": "PC-SALA-02", "ip": "192.168.1.51"},
        {"id": 3, "hostname": "SERVIDOR-PROY", "ip": "192.168.1.52"},
    ]

# --- API para que React dispare el ataque ---
@app.get("/actions/simulate-attack/{ip}")
async def simulate_attack(ip: str):
    await manager.broadcast({"type": "attack", "ip": ip})
    return {"status": "attack signal sent"}