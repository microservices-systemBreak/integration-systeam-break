export type DeviceStatus = "ONLINE" | "OFFLINE" | "ERROR";

export type Device = {
  id: string;          // ESTE es el deviceId que usarás en /reports/devices/{id}/...
  roomId: "1" | "2" | "3" | "4";
  pcNumber: number;    // número dentro de la sala (1,2,3...)
  name: string;        // nombre amigable
  status: DeviceStatus; // mock por ahora
};

export const DEVICES: Device[] = [
  { id: "pc01", roomId: "1", pcNumber: 1, name: "PC 01", status: "ONLINE" },
  { id: "pc02", roomId: "1", pcNumber: 2, name: "PC 02", status: "OFFLINE" },

  { id: "pc03", roomId: "2", pcNumber: 1, name: "PC 03", status: "ONLINE" },

  { id: "pc04", roomId: "3", pcNumber: 1, name: "PC 04", status: "ERROR" },

  { id: "pc05", roomId: "4", pcNumber: 1, name: "PC 05", status: "ONLINE" },
];

// Helper: construir salas desde DEVICES (sin duplicar info)
export const ROOMS = [
  { id: "1", name: "Sala 1" },
  { id: "2", name: "Sala 2" },
  { id: "3", name: "Sala 3" },
  { id: "4", name: "Sala 4" },
] as const;

export function getDevicesByRoom(roomId: string) {
  return DEVICES.filter((d) => d.roomId === roomId).sort((a, b) => a.pcNumber - b.pcNumber);
}
