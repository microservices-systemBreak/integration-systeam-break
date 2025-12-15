// src/app/(dashboard)/rooms/page.tsx
"use client";

import Link from "next/link";
import { ROOMS } from "@/src/config/inventory";

export default function RoomsPage() {
  const totalDevices = ROOMS.reduce(
    (acc, room) => acc + (room.devices?.length ?? 0),
    0
  );

  return (
    <div className="relative min-h-screen bg-[#05020b] text-slate-50 overflow-hidden">
      {/* FONDO SPLINE, GRANDE */}
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <spline-viewer
          url="https://prod.spline.design/NEQBXr1i0Otgs9Nn/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      {/* CONTENIDO */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400/90">
            System Break · Rooms
          </p>
          <h1 className="text-3xl font-black sm:text-4xl">
            Salas de laboratorio
          </h1>
          <p className="max-w-xl text-sm text-slate-200/80">
            Selecciona una sala para ver sus computadores y supervisar su estado
            de seguridad.
          </p>
        </header>

        {/* Resumen rápido */}
        <section className="flex flex-wrap gap-4 text-xs text-slate-200">
          <div className="rounded-2xl border border-fuchsia-500/40 bg-slate-900/60 px-4 py-3 backdrop-blur">
            <span className="text-slate-400 text-[11px]">Total de salas</span>
            <div className="text-2xl font-bold leading-snug">
              {ROOMS.length}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/60 px-4 py-3 backdrop-blur">
            <span className="text-slate-400 text-[11px]">Total de PCs</span>
            <div className="text-2xl font-bold leading-snug">
              {totalDevices}
            </div>
          </div>
        </section>

        {/* Cards de salas */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 
                         bg-slate-900/70 p-5 backdrop-blur-md transition 
                         hover:-translate-y-1 hover:border-fuchsia-400/80 hover:bg-slate-900/95"
            >
              {/* Glow de color al hacer hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-emerald-400/20" />
              </div>

              {/* Contenido */}
              <div className="relative flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-[11px] text-fuchsia-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  Sala #{room.id}
                </div>

                <h2 className="text-lg font-semibold">{room.name}</h2>

                <p className="text-xs text-slate-300">
                  Room ID:{" "}
                  <span className="font-mono text-fuchsia-200">
                    {room.id}
                  </span>
                </p>

                <p className="text-xs text-slate-400">
                  {room.devices?.length
                    ? `${room.devices.length} equipos registrados`
                    : "Sin equipos registrados (demo)"}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
