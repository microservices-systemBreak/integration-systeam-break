"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ROOMS, DeviceStatus } from "@/src/config/inventory";

export default function RoomDetailPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const room = ROOMS.find((r) => r.id === roomId);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const devices = room?.devices ?? [];

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesQuery =
        d.id.toLowerCase().includes(query.toLowerCase()) ||
        d.name.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === "ALL" ? true : d.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [devices, query, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every((d) => selected[d.id]);
  const someSelected = filtered.some((d) => selected[d.id]);

  const toggleAll = () => {
    const next: Record<string, boolean> = { ...selected };
    const value = !allSelected;
    filtered.forEach((d) => (next[d.id] = value));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!room) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Sala no encontrada</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>{room.name}</h1>

      {/* Barra de búsqueda + filtros */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por ID o nombre..."
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
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="ALL">Todos</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="ERROR">Error</option>
        </select>

        <button
          onClick={toggleAll}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
        </button>

        <span style={{ alignSelf: "center", opacity: 0.7 }}>
          Seleccionados:{" "}
          {Object.values(selected).filter(Boolean).length}
          {someSelected ? "" : ""}
        </span>
      </div>

      {/* Lista de PCs */}
      <div style={{ display: "grid", gap: 10, marginTop: 16, maxWidth: 700 }}>
        {filtered.map((d) => (
          <div
            key={d.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              padding: 14,
              background: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{d.name}</div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                ID: {d.id} • Estado: {d.status}
              </div>
            </div>

            <input
              type="checkbox"
              checked={!!selected[d.id]}
              onChange={() => toggleOne(d.id)}
              style={{ width: 18, height: 18 }}
            />
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ opacity: 0.7 }}>No hay resultados con esos filtros.</div>
        )}
      </div>
    </div>
  );
}
