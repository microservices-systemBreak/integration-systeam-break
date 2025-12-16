// src/config/incidents.ts

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentType = "PORT_SCAN" | "FLOOD" | "LOGIN_BRUTE_FORCE" | "MALWARE";

export interface Incident {
  id: number;
  deviceId: string;      // Debe coincidir con Device.id
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  detectedAt: string;    // ISO
}

export const INCIDENTS: Incident[] = [
  {
    id: 1,
    deviceId: "DEV-PC-001",              // Sala 1 - PC 01
    type: "PORT_SCAN",
    severity: "HIGH",
    description: "Escaneo de puertos intensivo desde 192.168.10.45 sobre los puertos 22, 80 y 443.",
    detectedAt: "2025-12-13T09:15:00Z",
  },
  {
    id: 2,
    deviceId: "DEV-PC-002",              // Sala 1 - PC 02
    type: "FLOOD",
    severity: "CRITICAL",
    description: "Posible ataque de tipo SYN flood detectado. Pico de conexiones simultáneas anormal.",
    detectedAt: "2025-12-13T09:22:30Z",
  },
  {
    id: 3,
    deviceId: "room2-pc-01",             // Sala 2 - PC 01
    type: "LOGIN_BRUTE_FORCE",
    severity: "MEDIUM",
    description: "Múltiples intentos fallidos de inicio de sesión en menos de 2 minutos.",
    detectedAt: "2025-12-13T10:05:10Z",
  },
  {
    id: 4,
    deviceId: "room3-pc-05",             // Sala 3 - PC 05
    type: "MALWARE",
    severity: "CRITICAL",
    description: "Archivo sospechoso detectado en C:\\temp\\installer.exe con comportamiento anómalo.",
    detectedAt: "2025-12-13T10:47:00Z",
  },
  {
    id: 5,
    deviceId: "room4-pc-03",             // Sala 4 - PC 03
    type: "PORT_SCAN",
    severity: "LOW",
    description: "Escaneo ligero de puertos desde otra máquina interna del laboratorio.",
    detectedAt: "2025-12-13T11:10:25Z",
  },
];
