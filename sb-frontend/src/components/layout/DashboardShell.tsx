"use client";

import Sidebar from "./Sidebar";  // Menú lateral
import Topbar from "./Topbar";    // Barra superior

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 16 }}>
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
