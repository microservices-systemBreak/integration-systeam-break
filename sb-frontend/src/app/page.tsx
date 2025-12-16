"use client";

import Script from "next/script";
import Link from "next/link";
import Sidebar from "@/src/components/layout/Sidebar";
import { DEVICES, ROOMS } from "@/src/config/inventory";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const totalRooms = ROOMS.length;
const totalDevices = DEVICES.length;

const statusCounts = (() => {
  let online = 0;
  let offline = 0;
  let error = 0;

  DEVICES.forEach((d) => {
    if (d.status === "ONLINE") online++;
    else if (d.status === "OFFLINE") offline++;
    else if (d.status === "ERROR") error++;
  });

  return [
    { status: "Online", count: online },
    { status: "Offline", count: offline },
    { status: "Error", count: error },
  ];
})();

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal (scrollable) */}
      <main className="flex-1 overflow-y-auto">
        {/* Script de Spline solo se carga una vez */}
        <Script
          type="module"
          src="https://unpkg.com/@splinetool/viewer@1.12.16/build/spline-viewer.js"
          strategy="lazyOnload"
        />

        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          {/* 1) HERO */}
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Texto */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-900/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Sistema de monitoreo en tiempo real
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                System Break
              </h1>
              <p className="mt-3 text-lg font-semibold text-purple-300">
                Expertos en ciberseguridad para laboratorios y salas de cómputo.
              </p>

              <p className="mt-5 max-w-xl text-sm text-gray-300">
                Controla el estado de todos los PCs, detecta incidentes, ejecuta
                simulaciones de ataque y analiza reportes desde un solo
                dashboard.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/rooms"
                  className="rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/40 transition hover:bg-purple-500"
                >
                  Ver salas monitoreadas
                </Link>
                <Link
                  href="/reports"
                  className="text-xs font-semibold text-gray-300 underline-offset-4 hover:text-purple-300 hover:underline"
                >
                  Ver reportes de seguridad
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-xs text-gray-400">
                <div>
                  <span className="block text-sm font-bold text-purple-300">
                    {totalRooms}
                  </span>
                  Salas de laboratorio
                </div>
                <div>
                  <span className="block text-sm font-bold text-purple-300">
                    {totalDevices}
                  </span>
                  Computadores monitoreados
                </div>
              </div>
            </div>

            {/* Spline */}
            <div className="relative h-[280px] rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-black/60 p-3 shadow-[0_0_60px_rgba(168,85,247,0.35)] sm:h-[360px]">
              {/* @ts-ignore: Web Component de Spline */}
              <spline-viewer
                url="https://prod.spline.design/xV-NrftR4gWpErba/scene.splinecode"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                }}
              />
            </div>
          </section>

          {/* 2) Métricas + gráfica */}
          <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] lg:items-start">
            {/* Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Estado general del sistema</h2>
              <p className="text-sm text-gray-300">
                Resumen rápido del laboratorio: cuántas salas y computadores
                tienes bajo monitoreo y su estado actual.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/rooms"
                  className="group rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4 shadow-lg shadow-purple-500/20 transition hover:-translate-y-1 hover:border-purple-400 hover:bg-purple-900/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-200">
                    Salas
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {totalRooms}
                  </p>
                  <p className="mt-1 text-xs text-purple-100/80">
                    Ver detalle de cada sala y sus PCs.
                  </p>
                </Link>

                <Link
                  href="/devices"
                  className="group rounded-2xl border border-purple-500/20 bg-white/5 p-4 shadow-lg shadow-purple-800/30 transition hover:-translate-y-1 hover:border-purple-400 hover:bg-white/[0.08]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-200">
                    Computadores
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {totalDevices}
                  </p>
                  <p className="mt-1 text-xs text-gray-200">
                    Vista global de todos los equipos.
                  </p>
                </Link>
              </div>
            </div>

            {/* Gráfica de estado PCs */}
            <div className="rounded-2xl border border-purple-500/20 bg-white/[0.02] p-4 shadow-lg shadow-purple-900/30">
              <h3 className="text-sm font-semibold text-purple-100">
                Estado de los computadores
              </h3>
              <p className="mt-1 text-xs text-gray-300">
                Distribución de equipos online, offline y con errores.
              </p>

              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer>
                  <BarChart data={statusCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="status"
                      tick={{ fill: "#e5e7eb", fontSize: 12 }}
                      axisLine={{ stroke: "#4b5563" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#e5e7eb", fontSize: 12 }}
                      axisLine={{ stroke: "#4b5563" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderRadius: 12,
                        border: "1px solid rgba(168,85,247,0.5)",
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Bar dataKey="count" name="Equipos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* 3) Intro */}
          <section className="mt-16 space-y-6 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/60 via-black to-purple-950/40 p-6 shadow-[0_0_50px_rgba(88,28,135,0.55)]">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold">Cómo utilizar System Break</h2>
              <p className="mt-2 text-sm text-gray-200">
                Este panel está pensado para que cualquier persona del equipo
                pueda entender el estado de la infraestructura sin ser experta
                en ciberseguridad.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-purple-200">
                  1. Monitorea las salas
                </h3>
                <p className="mt-2 text-xs text-gray-200">
                  En <span className="font-semibold">Salas</span> ves cada
                  laboratorio y los PCs que contiene. Desde ahí puedes filtrar,
                  buscar por ID y seleccionar equipos.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-purple-200">
                  2. Revisa incidentes y reportes
                </h3>
                <p className="mt-2 text-xs text-gray-200">
                  En <span className="font-semibold">Incidentes</span> se listan
                  ataques detectados y en{" "}
                  <span className="font-semibold">Reportes</span> ves gráficas
                  globales para tomar decisiones rápidas.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-purple-200">
                  3. Simula ataques controlados
                </h3>
                <p className="mt-2 text-xs text-gray-200">
                  Desde <span className="font-semibold">Attacker</span> puedes
                  lanzar pruebas contra PCs del laboratorio para validar que los
                  agentes y los reportes funcionen correctamente.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
