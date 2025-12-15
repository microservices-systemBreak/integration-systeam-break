// src/app/(dashboard)/reports/page.tsx
"use client";

import { useMemo } from "react";
import {
  DEVICES,
  INCIDENTS,
  IncidentSeverity,
} from "@/src/config/inventory";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function ReportsPage() {
  /**
   * 1) Métricas generales
   */
  const totalDevices = DEVICES.length;
  const totalIncidents = INCIDENTS.length;

  const affectedDevicesCount = useMemo(() => {
    const set = new Set(INCIDENTS.map((i) => i.deviceId));
    return set.size;
  }, []);

  const criticalIncidents = INCIDENTS.filter(
    (i) => i.severity === "CRITICAL"
  ).length;

  /**
   * 2) Incidentes por severidad (para gráfico de barras)
   */
  const severities: IncidentSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const severityData = useMemo(() => {
    const base: Record<IncidentSeverity, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    INCIDENTS.forEach((inc) => {
      base[inc.severity] = (base[inc.severity] || 0) + 1;
    });

    return severities.map((sev) => ({
      severity: severityLabel(sev),
      count: base[sev],
    }));
  }, []);

  /**
   * 3) Incidentes por sala (para otro gráfico de barras)
   */
  const incidentsByRoomData = useMemo(() => {
    const map = new Map<string, number>(); // roomName/roomId -> count

    INCIDENTS.forEach((inc) => {
      const device = DEVICES.find((d) => d.id === inc.deviceId);
      const roomKey = device?.roomName ?? device?.roomId ?? "Desconocida";
      map.set(roomKey, (map.get(roomKey) || 0) + 1);
    });

    return Array.from(map.entries()).map(([room, count]) => ({
      room,
      count,
    }));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>Reportes</h1>
      <p style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
        Resumen visual del estado de seguridad: computadores monitoreados,
        incidentes y su distribución por severidad y sala.
      </p>

      {/* 1) Tarjetas de métricas rápidas */}
      <section
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <MetricCard
          title="Computadores monitoreados"
          value={totalDevices}
          helper="Equipos registrados en todas las salas."
        />
        <MetricCard
          title="Incidentes registrados"
          value={totalIncidents}
          helper="Eventos detectados por el sistema."
        />
        <MetricCard
          title="PCs afectados"
          value={affectedDevicesCount}
          helper="Equipos con al menos un incidente."
        />
        <MetricCard
          title="Incidentes críticos"
          value={criticalIncidents}
          helper="Casos de máxima prioridad."
        />
      </section>

      {/* 2) Gráfico de barras por severidad */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>
          Incidentes por severidad
        </h2>
        <p style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
          Cuántos incidentes se han detectado en cada nivel de severidad.
        </p>

        <div style={{ marginTop: 12, width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Incidentes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3) Gráfico de barras por sala */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Incidentes por sala</h2>
        <p style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
          Distribución de incidentes entre las salas del laboratorio.
        </p>

        <div style={{ marginTop: 12, width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={incidentsByRoomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="room" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Incidentes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

/**
 * 🔹 Pequeño componente para las tarjetas de métrica
 */
type MetricCardProps = {
  title: string;
  value: number;
  helper?: string;
};

function MetricCard({ title, value, helper }: MetricCardProps) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 14,
        background: "white",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.7 }}>{title}</span>
      <span style={{ fontSize: 22, fontWeight: 900 }}>{value}</span>
      {helper && (
        <span style={{ fontSize: 12, opacity: 0.7 }}>{helper}</span>
      )}
    </div>
  );
}

/**
 * 🔹 Texto bonito para la severidad
 */
function severityLabel(s: IncidentSeverity) {
  switch (s) {
    case "LOW":
      return "Baja";
    case "MEDIUM":
      return "Media";
    case "HIGH":
      return "Alta";
    case "CRITICAL":
      return "Crítica";
    default:
      return s;
  }
}
