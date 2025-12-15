"use client";

import { useMemo, useState } from "react";
import { DEVICES, DeviceStatus } from "@/src/config/inventory";
import Card from "@/src/components/card/card";  

type Command = "POWER_ON" | "POWER_OFF" | "WELCOME";

export default function DevicesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Lista filtrada por búsqueda + estado
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

  // Selección
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

  // Comandos simulados (luego aquí pegamos el POST /core/commands)
  const sendCommand = (action: Command) => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un computador.");
      return;
    }

    console.log("Comando:", action, "a PCs:", selectedIds);

    if (action === "WELCOME") {
      alert(`Se Actualizó ${selectedIds.length} equipo(s).`);
    } else if (action === "POWER_ON") {
      alert(`Se envió comando de ENCENDER a ${selectedIds.length} equipo(s).`);
    } else {
      alert(`Se envió comando de APAGAR a ${selectedIds.length} equipo(s).`);
    }
  };

  // Helper visual para el badge de estado
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Fondo con Spline */}
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <spline-viewer
          url="https://prod.spline.design/NEQBXr1i0Otgs9Nn/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      {/* Contenido */}
      <main className="relative mx-auto flex flex-col gap-8 px-6 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold">Computadores</h1>
        <p className="opacity-0.7 text-lg">Vista global de todos los PCs.</p>

        {/* Barra de búsqueda + filtros + seleccionar todos */}
        <div className="flex gap-10 mt-16 flex-wrap items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ID, nombre u hostname..."
            className="p-3 rounded-lg border border-gray-600 min-w-[250px] bg-gray-800"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-3 rounded-lg border border-gray-600 bg-gray-800"
          >
            <option value="ALL">Todos</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="ERROR">Error</option>
          </select>

          <button
            onClick={toggleAll}
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700"
          >
            {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
          </button>

          <span className="text-sm opacity-70">
            Seleccionados: {selectedIds.length}
          </span>
        </div>

        {/* Botones de acciones masivas */}
        <div className="flex gap-8 mt-6">
          <button
            onClick={() => sendCommand("POWER_ON")}
            className="px-6 py-3 rounded-lg border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            Encender seleccionados
          </button>

          <button
            onClick={() => sendCommand("POWER_OFF")}
            className="px-6 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Apagar seleccionados
          </button>

          <button
            onClick={() => sendCommand("WELCOME")}
            className="px-6 py-3 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Actualizar
          </button>
        </div>

        {/* Lista de PCs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <Card
              key={d.id}
              id={d.id}  // Aquí agregamos el ID que falta
              title={d.name}
              content={`ID: ${d.id}`}
              status={d.status.toLowerCase() as "online" | "offline" | "error"}
              extraInfo={`Sala: ${d.roomName ?? d.roomId} • PC #${d.pcNumber ?? "?"}`}
              onClick={() => toggleOne(d.id)} // Función de clic para seleccionar
            />
          ))}
        </div>
      </main>
    </div>
  );
}
