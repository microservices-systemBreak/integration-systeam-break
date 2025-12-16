"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ROOMS, DeviceStatus,  getDevicesByRoom, RoomId, } from "@/src/config/inventory";
import Card from "@/src/components/card/card";

export default function RoomDetailPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId as RoomId;

  const room = ROOMS.find((r) => r.id === roomId);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");

  const [selected, setSelected] = useState<Record<string, boolean>>({});

   const devices = useMemo(() => getDevicesByRoom(roomId), [roomId]);

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesQuery =
        d.id.toLowerCase().includes(query.toLowerCase()) ||
        d.name.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : d.status === statusFilter;

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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {filtered.map((d) => (
          <Card
            key={d.id}
            id={d.id}
            title={d.name}
            subtitle={`PC #${d.pcNumber ?? "?"}`}
            status={d.status.toLowerCase() as "online" | "offline" | "error"}
            onClick={() => toggleOne(d.id)}
          >
            <p className="text-xs text-slate-300">
              ID: <span className="font-mono text-fuchsia-200">{d.id}</span>
            </p>
            <p className="text-xs text-slate-400">
              Estado: {d.status}
            </p>
            <div className="mt-2 flex justify-end">
              <input
                type="checkbox"
                checked={!!selected[d.id]}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleOne(d.id);
                }}
                className="w-4 h-4 rounded border-gray-400 text-fuchsia-600 focus:ring-fuchsia-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-slate-400">No hay resultados con esos filtros.</div>
        )}
      </div>
    </div>
  );
}
