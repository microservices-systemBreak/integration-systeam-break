"use client";

import { useEffect, useMemo, useState } from "react";
import { DEVICES } from "@/src/config/devices";
import { getLatestPackages, ScanResponseDto } from "@/src/services/reports.service";

type DeviceRow =
  | { deviceId: string; ok: true; data: ScanResponseDto }
  | { deviceId: string; ok: false; error: string };

export default function DevicesPage() {
  const [rows, setRows] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all");

  async function load() {
    setLoading(true);

    const results = await Promise.all(
      DEVICES.map(async (device) => {
        try {
          const data = await getLatestPackages(device.id);
          return { deviceId: device.id, ok: true, data } as const;
        } catch (e: any) {
          return {
            deviceId: device.id,
            ok: false,
            error: e?.message ?? "Request failed",
          } as const;
        }
      })
    );

    setRows(results);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.deviceId.toLowerCase().includes(q) ||
        (r.ok && (
          r.data.hostname?.toLowerCase().includes(q) ||
          r.data.ipAddress?.toLowerCase().includes(q)
        ));

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "online"
          ? r.ok
          : !r.ok;

      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Computadores</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>
        Prueba rápida de conexión: si responde el latest → Online.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por ID, hostname o IP..."
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10, width: 320 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
        >
          <option value="all">Todos</option>
          <option value="online">Online</option>
          <option value="offline">Offline/Error</option>
        </select>

        <button
          onClick={load}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <p style={{ marginTop: 18 }}>Cargando…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 18 }}>
          {filtered.map((r) => (
            <div
              key={r.deviceId}
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong>{r.deviceId}</strong>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    border: "1px solid #ddd",
                  }}
                >
                  {r.ok ? "ONLINE" : "OFFLINE/ERROR"}
                </span>
              </div>

              {r.ok ? (
                <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>
                  <div><b>Hostname:</b> {r.data.hostname}</div>
                  <div><b>IP:</b> {r.data.ipAddress}</div>
                  <div><b>OS:</b> {r.data.operatingSystem}</div>
                  <div><b>Severidad:</b> {r.data.overallSeverity}</div>
                  <div><b>Vulnerables:</b> {r.data.vulnerablePackages} / {r.data.totalPackages}</div>
                </div>
              ) : (
                <div style={{ marginTop: 10, fontSize: 13, color: "#b00020" }}>
                  Error: {r.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
