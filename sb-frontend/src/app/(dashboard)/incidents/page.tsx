// src/app/(dashboard)/incidents/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  INCIDENTS,
  Incident,
  IncidentSeverity,
  IncidentType,
  DEVICES,
} from "@/src/config/inventory";
import Card from "@/src/components/card/card";

type SeverityFilter = "ALL" | IncidentSeverity;
type TypeFilter = "ALL" | IncidentType;

interface IncidentWithDevice extends Incident {
  deviceName?: string;
  roomName?: string;
  pcNumber?: number | string;
}

export default function IncidentsPage() {
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");

  // 🧠 Enlazamos incidente -> dispositivo (para mostrar sala, nombre y # de PC)
  const incidentsWithDevice: IncidentWithDevice[] = useMemo(() => {
    return INCIDENTS.map((inc) => {
      const device = DEVICES.find((d) => d.id === inc.deviceId);

      return {
        ...inc,
        deviceName: device?.name,
        roomName: device?.roomName ?? device?.roomId,
        pcNumber: device?.pcNumber,
      };
    }).sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    ); // más recientes primero
  }, []);

  // 🔎 Búsqueda + filtros (texto, severidad, tipo)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return incidentsWithDevice.filter((inc) => {
      const matchesQuery =
        q.length === 0 ||
        inc.deviceId.toLowerCase().includes(q) ||
        (inc.deviceName && inc.deviceName.toLowerCase().includes(q)) ||
        inc.description.toLowerCase().includes(q) ||
        (inc.roomName && inc.roomName.toLowerCase().includes(q));

      const matchesSeverity =
        severityFilter === "ALL" ? true : inc.severity === severityFilter;

      const matchesType =
        typeFilter === "ALL" ? true : inc.type === typeFilter;

      return matchesQuery && matchesSeverity && matchesType;
    });
  }, [query, severityFilter, typeFilter, incidentsWithDevice]);

  // 🎨 Helpers visuales
  const severityStyle = (severity: IncidentSeverity): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: "3px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
    };

    switch (severity) {
      case "CRITICAL":
        return { ...base, backgroundColor: "#ffebee", color: "#b71c1c" };
      case "HIGH":
        return { ...base, backgroundColor: "#fff3e0", color: "#e65100" };
      case "MEDIUM":
        return { ...base, backgroundColor: "#fffde7", color: "#f9a825" };
      case "LOW":
      default:
        return { ...base, backgroundColor: "#e8f5e9", color: "#1b5e20" };
    }
  };

  const typeStyle = (type: IncidentType): React.CSSProperties => ({
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: "#e3f2fd",
    color: "#0d47a1",
  });

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });

  // Mapear severity a status del Card
  const severityToStatus = (severity: IncidentSeverity): "online" | "offline" | "error" | "warning" => {
    switch (severity) {
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
      case "LOW":
      default:
        return "online";
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fondo spline */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {/* @ts-ignore: Web Component de Spline */}
        <spline-viewer
          url="https://prod.spline.design/ffn2PNe9fYpcO7yA/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Incidentes</h1>
        <p style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
          Historial de ataques detectados por agente, con sala, severidad y
          detalle técnico.
        </p>

        {/* Filtros superiores */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por PC, sala, id o descripción..."
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
          />

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          >
            <option value="ALL">Todas las severidades</option>
            <option value="CRITICAL">Críticos</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          >
            <option value="ALL">Todos los tipos</option>
            <option value="PORT_SCAN">Port scan</option>
            <option value="FLOOD">Flood / DoS</option>
            <option value="LOGIN_BRUTE_FORCE">Brute force</option>
            <option value="MALWARE">Malware</option>
          </select>

          <span style={{ fontSize: 13, opacity: 0.7 }}>
            Incidentes: {filtered.length}
          </span>
        </div>

        {/* Lista de incidentes */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
          {filtered.map((inc) => (
            <Card
              key={inc.id}
              id={String(inc.id)}
              title={inc.deviceName ?? inc.deviceId}
              subtitle={`Sala: ${inc.roomName ?? "Desconocida"}${inc.pcNumber ? ` • PC #${inc.pcNumber}` : ""}`}
              status={severityToStatus(inc.severity)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  <span style={typeStyle(inc.type)} className="inline-block">
                    {inc.type}
                  </span>
                  <span style={severityStyle(inc.severity)} className="inline-block">
                    {inc.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{inc.description}</p>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>ID: {inc.id}</span>
                  <span>{formatDateTime(inc.detectedAt)}</span>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-slate-400">
              No hay incidentes con esos filtros. Prueba limpiando la búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
