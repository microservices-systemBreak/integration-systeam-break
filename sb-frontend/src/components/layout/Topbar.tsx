"use client";

import { useAuth } from "@/src/contexts/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  const initial =
    user?.email && user.email.length > 0
      ? user.email.charAt(0).toUpperCase()
      : "?";

  return (
    <header className="flex items-center justify-between border-b border-purple-900/40 bg-black/80 px-4 py-3 backdrop-blur md:px-6">
      {/* Lado izquierdo: título del panel */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300">
          System Break
        </p>
        <h1 className="text-sm font-semibold text-white">
          Cybersecurity Dashboard
        </h1>
      </div>

      {/* Lado derecho: usuario + logout */}
      <div className="flex items-center gap-4">
        {/* Info del usuario */}
        <div className="hidden text-right text-xs md:block">
          <p className="font-semibold text-white">
            {user?.email ?? "Invitado"}
          </p>
          <p className="text-[11px] text-gray-400">Sesión activa</p>
        </div>

        {/* Avatar con inicial */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-xs font-bold uppercase text-white shadow-[0_0_18px_rgba(168,85,247,0.8)]">
          {initial}
        </div>

        {/* Botón logout */}
        <button
          onClick={logout}
          className="rounded-full border border-purple-500/60 px-3 py-1 text-[11px] font-semibold text-purple-100 transition hover:border-purple-300 hover:bg-purple-600/40"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

