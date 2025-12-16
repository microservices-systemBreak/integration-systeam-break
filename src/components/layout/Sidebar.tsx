// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/rooms", label: "Salas" },
  { href: "/devices", label: "Computadores" },
  { href: "/incidents", label: "Incidentes" },
  { href: "/reports", label: "Reportes" },
  { href: "/attacker", label: "Attacker" },
  { href: "/chat-ia", label: "Chat IA" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-purple-900/40 bg-black/95 px-4 py-6">
      {/* Logo / título */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xs font-extrabold text-white shadow-[0_0_25px_rgba(168,85,247,0.8)]">
          SB
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">System Break</h2>
          <p className="text-[11px] text-purple-300">
            Cybersecurity dashboard
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 text-sm">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href === "/dashboard" ? "/" : item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                active
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                  : "text-gray-300 hover:bg-purple-900/40 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-purple-900/40 pt-4 text-[11px] text-gray-500">
        <p>Monitoreo en tiempo real de PCs.</p>
        <p className="text-purple-300">RIWI · System Break</p>
      </div>
    </aside>
  );
}

