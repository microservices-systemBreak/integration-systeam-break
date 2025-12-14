"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside style={{ width: 250, backgroundColor: "#f4f4f4", padding: 16 }}>
      <h3>SB Management</h3>

      <nav style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <Link href="/">Inicio</Link>
        <Link href="/rooms">Salas</Link>
        <Link href="/devices">Computadores</Link>
        <Link href="/incidents">Incidentes</Link>
        <Link href="/reports">Reportes</Link>
      </nav>
    </aside>
  );
}
