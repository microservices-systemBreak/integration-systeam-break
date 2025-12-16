// src/services/reports.service.ts
import { http } from "./http";

export type ScanResponseDto = {
  id: number;
  correlationId: string;
  agentId: string;
  hostname: string;
  ipAddress: string;
  operatingSystem: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  overallSeverity: string;
  totalPackages: number;
  vulnerablePackages: number;
};

export async function getLatestPackages(deviceId: string) {
  const { data } = await http.get<ScanResponseDto>(
    `/reports/devices/${deviceId}/packages/latest`
  );
  return data;
}
