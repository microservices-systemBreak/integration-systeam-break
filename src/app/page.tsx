"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/src/components/layout/DashboardShell";

const STORAGE_KEY = "authUser"; // ajusta si tu key es otra

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) router.replace("/login");
  }, [router]);

  return (
    <DashboardShell title="Inicio">
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>SB Management</h1>
        <p style={{ opacity: 0.75, marginTop: 6 }}>
          Monitorea PCs por salas, revisa incidentes y consulta reportes.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ width: 260, border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
            <div style={{ opacity: 0.7 }}>Total salas</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>4</div>
          </div>

          <div style={{ width: 260, border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
            <div style={{ opacity: 0.7 }}>Total PCs</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>8</div>
          </div>
        </div>

        <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>PCs por sala (demo)</h2>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            Luego la conectamos al API Gateway.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
