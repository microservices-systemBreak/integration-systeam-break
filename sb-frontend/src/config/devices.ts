// src/config/devices.ts

// Salas disponibles
export type RoomId = "1" | "2" | "3" | "4";

// Estado de un PC
export type DeviceStatus = "ONLINE" | "OFFLINE" | "ERROR";

// Tipo base de un computador
export type Device = {
  id: string;        // ID real que usará el backend (para /reports/devices/{id})
  roomId: RoomId;    // Sala a la que pertenece
  pcNumber: number;  // Número dentro de la sala (1..10)
  name: string;      // Nombre amigable que muestras en la UI
  status: DeviceStatus;
  

  // Campos opcionales que ya usamos en otras vistas
  roomName?: string;
  hostname?: string;
  ip?: string;
  operatingSystem?: string;
};

// 🔹 Sala 1: aquí deben ir TUS PCs reales (adapta los ids)
const ROOM_1_DEVICES: Device[] = [
  { id: "DEV-PC-001", roomId: "1", pcNumber: 1, name: "Sala 1 - PC 01", status: "ONLINE",  operatingSystem: "Ubuntu 22.04",
},
  { id: "DEV-PC-002", roomId: "1", pcNumber: 2, name: "Sala 1 - PC 02", status: "OFFLINE" ,operatingSystem: "Windows 10",},
  // agrega los que necesites...
];

// 🔹 Helper para generar 10 PCs mock en las salas 2,3,4
function buildRoomDevices(roomId: RoomId, prefix: string): Device[] {
  return Array.from({ length: 10 }, (_, index) => {
    const pcNumber = index + 1;
    const id = `${prefix}-${pcNumber.toString().padStart(2, "0")}`; // ej: room2-pc-01

    return {
      id,
      roomId,
      pcNumber,
      name: `Sala ${roomId} - PC ${pcNumber}`,
      status: "ONLINE",
    };
  });
}

const ROOM_2_DEVICES = buildRoomDevices("2", "room2-pc");
const ROOM_3_DEVICES = buildRoomDevices("3", "room3-pc");
const ROOM_4_DEVICES = buildRoomDevices("4", "room4-pc");

// 🔹 Fuente de verdad: todos los PCs
export const DEVICES: Device[] = [
  ...ROOM_1_DEVICES,
  ...ROOM_2_DEVICES,
  ...ROOM_3_DEVICES,
  ...ROOM_4_DEVICES,
];

// Helpers útiles para varias páginas
export function getDevicesByRoom(roomId: RoomId): Device[] {
  return DEVICES.filter((d) => d.roomId === roomId).sort((a, b) => a.pcNumber - b.pcNumber);
}

export function getDeviceById(id: string): Device | undefined {
  return DEVICES.find((d) => d.id === id);
}
