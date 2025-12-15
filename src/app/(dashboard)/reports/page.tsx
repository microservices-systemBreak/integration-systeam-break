"use client";

import { useMemo } from "react";
import { DEVICES, INCIDENTS, IncidentSeverity } from "@/src/config/inventory";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ReportsPage() {
  // Total de dispositivos y incidentes
  const totalDevices = DEVICES.length;
  const totalIncidents = INCIDENTS.length;

  const affectedDevicesCount = useMemo(() => {
    const set = new Set(INCIDENTS.map((i) => i.deviceId));
    return set.size;
  }, []);

  const criticalIncidents = INCIDENTS.filter(
    (i) => i.severity === "CRITICAL"
  ).length;

  // Incidentes por severidad (para gráfico de barras)
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

  // Configuración gráfica de línea (como las gráficas que te mostraron)
  const data = [
    { name: "Enero", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Febrero", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Marzo", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Abril", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Mayo", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Junio", uv: 2390, pv: 3800, amt: 2500 },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fondo Spline */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <spline-viewer
          url="https://prod.spline.design/ffn2PNe9fYpcO7yA/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      {/* Contenido de la página */}
      <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Sección de métricas */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-900/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Resumen de Incidentes
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              System Break
            </h1>
            <p className="mt-3 text-lg font-semibold text-purple-300">
              Visión general de los incidentes de ciberseguridad y distribución.
            </p>

            <p className="mt-5 max-w-xl text-sm text-gray-300">
              Aquí se visualizan los incidentes por severidad y distribuidos por
              las salas de laboratorio.
            </p>
          </div>
        </section>

        {/* Tarjetas de métricas */}
        <section className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
            <p className="text-xl text-white font-bold">Incidentes Críticos</p>
            <p className="text-3xl text-white font-extrabold">{criticalIncidents}</p>
          </div>
          <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
            <p className="text-xl text-white font-bold">Dispositivos Afectados</p>
            <p className="text-3xl text-white font-extrabold">{affectedDevicesCount}</p>
          </div>
          <div className="bg-purple-800 p-6 rounded-xl shadow-lg">
            <p className="text-xl text-white font-bold">Total de Incidentes</p>
            <p className="text-3xl text-white font-extrabold">{totalIncidents}</p>
          </div>
        </section>

        {/* Gráfico de Incidentes por Severidad */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white">Incidentes por Severidad</h2>
          <div className="mt-4 w-full h-64">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Gráfico de Incidentes por Sala */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white">Incidentes por Sala</h2>
          <div className="mt-4 w-full h-64">
            <ResponsiveContainer>
              <LineChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#e63946" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Función para mostrar las severidades de los incidentes de forma legible
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
