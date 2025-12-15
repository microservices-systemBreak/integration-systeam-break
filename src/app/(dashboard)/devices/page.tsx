// src/app/(dashboard)/devices/page.tsx
"use client";

import { useMemo, useState } from "react";
import { DEVICES, DeviceStatus } from "@/src/config/inventory";

type Command = "POWER_ON" | "POWER_OFF" | "WELCOME";

export default function DevicesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // 1) Lista filtrada por búsqueda + estado
  const filtered = useMemo(() => {
    return DEVICES.filter((d) => {
      const q = query.toLowerCase().trim();

      const matchesQuery =
        q.length === 0 ||
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        (d.hostname && d.hostname.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" ? true : d.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  // 2) Selección
  const allSelected =
    filtered.length > 0 && filtered.every((d) => selected[d.id]);
  const selectedIds = filtered
    .filter((d) => selected[d.id])
    .map((d) => d.id);

  const toggleOne = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const value = !allSelected;
    const next: Record<string, boolean> = { ...selected };
    filtered.forEach((d) => {
      next[d.id] = value;
    });
    setSelected(next);
  };

  // 3) Comandos simulados (luego aquí pegamos el POST /core/commands)
  const sendCommand = (action: Command) => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un computador.");
      return;
    }

    console.log("Comando:", action, "a PCs:", selectedIds);

    if (action === "WELCOME") {
      alert(
        `Se envió mensaje de bienvenida a ${selectedIds.length} equipo(s).`
      );
    } else if (action === "POWER_ON") {
      alert(`Se envió comando de ENCENDER a ${selectedIds.length} equipo(s).`);
    } else {
      alert(`Se envió comando de APAGAR a ${selectedIds.length} equipo(s).`);
    }
  };

  // 4) Helper visual para el badge de estado
  const getStatusStyle = (status: DeviceStatus): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: "4px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
    };

    if (status === "ONLINE") {
      return { ...base, backgroundColor: "#e6f4ea", color: "#0b8043" };
    }
    if (status === "ERROR") {
      return { ...base, backgroundColor: "#fdecea", color: "#c5221f" };
    }
    return { ...base, backgroundColor: "#f1f3f4", color: "#5f6368" }; // OFFLINE
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>Computadores</h1>
      <p style={{ marginTop: 4, opacity: 0.7, fontSize: 13 }}>
        Vista global de todos los PCs. Puedes buscar, filtrar, seleccionar y
        enviar acciones masivas.
      </p>

      {/* Barra de búsqueda + filtros + seleccionar todos */}
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
          placeholder="Buscar por ID, nombre u hostname..."
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 260,
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          <option value="ALL">Todos</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="ERROR">Error</option>
        </select>

        <button
          onClick={toggleAll}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
        </button>

        <span style={{ fontSize: 13, opacity: 0.7 }}>
          Seleccionados: {selectedIds.length}
        </span>
      </div>

      {/* Botones de acciones masivas */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => sendCommand("POWER_ON")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #0a0",
            cursor: "pointer",
          }}
        >
          Encender seleccionados
        </button>

        <button
          onClick={() => sendCommand("POWER_OFF")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #c00",
            cursor: "pointer",
          }}
        >
          Apagar seleccionados
        </button>

        <button
          onClick={() => sendCommand("WELCOME")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #005",
            cursor: "pointer",
          }}
        >
          Mensaje de bienvenida
        </button>
      </div>

      {/* Lista de PCs */}
      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {filtered.map((d) => (
          <div
            key={d.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              padding: 14,
              background: "white",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>{d.name}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  ID: {d.id}
                </div>
              </div>

              <span style={getStatusStyle(d.status)}>{d.status}</span>
            </div>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              Sala: <strong>{d.roomName ?? d.roomId}</strong> • PC #
              <strong>{d.pcNumber ?? "?"}</strong>
              {d.ip && <> • IP: {d.ip}</>}
            </div>

            <div style={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={!!selected[d.id]}
                  onChange={() => toggleOne(d.id)}
                  style={{ width: 16, height: 16 }}
                />
                Seleccionar
              </label>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ opacity: 0.7 }}>No hay computadores con esos filtros.</div>
        )}
      </div>
    </div>
  );
}
