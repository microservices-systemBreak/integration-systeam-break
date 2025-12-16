"use client";

import { useState } from "react";
import { DEVICES, type DeviceStatus } from "@/src/config/inventory";
import { Notificaction } from "@/src/helpers/utils"; // ajusta la ruta si tu helper está en otro sitio

export default function AttackerPage() {
  const [runningTarget, setRunningTarget] = useState<string | null>(null);

  const handleAttack = (deviceId: string) => {
    const device = DEVICES.find((d) => d.id === deviceId);

    setRunningTarget(deviceId);

    const message = `Ataque simulado lanzado contra ${
      device?.name ?? deviceId
    }. Revisa el panel de incidentes y reportes.`;

    console.log("Ataque simulado →", {
      deviceId,
      device,
    });

    // 🔔 Toast morado
    Notificaction(message, "success");

    setTimeout(() => {
      setRunningTarget(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <header className="mb-8 flex flex-col gap-3 border-b border-purple-900/40 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Attack Simulator
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-300">
              Lanza un ataque simulado contra un PC del laboratorio para probar
              el flujo de seguridad de System Break.
            </p>
          </div>

          <div className="rounded-xl border border-purple-500/40 bg-purple-950/40 px-3 py-2 text-[11px] text-purple-100">
            <p className="font-semibold text-purple-200">Modo</p>
            <p>Simulación solo frontend (React + toasts)</p>
          </div>
        </header>

        {/* Tabla de equipos */}
        <section className="rounded-3xl border border-purple-900/40 bg-gradient-to-br from-purple-950/60 via-black to-purple-950/40 p-4 shadow-[0_0_40px_rgba(76,29,149,0.7)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-purple-100">
                Equipos disponibles para ataque simulado
              </h2>
              <p className="text-xs text-gray-300">
                Selecciona un PC y presiona{" "}
                <span className="font-semibold">Lanzar ataque</span>. El
                resultado aparecerá como notificación.
              </p>
            </div>
            <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-gray-300">
              Computadores registrados:{" "}
              <span className="font-semibold text-purple-200">
                {DEVICES.length}
              </span>
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-purple-900/50 bg-black/60">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-purple-950/60">
                <tr className="text-left text-[11px] uppercase tracking-wide text-purple-100">
                  <th className="px-4 py-3">Sala</th>
                  <th className="px-4 py-3">PC</th>
                  <th className="px-4 py-3">ID Agente</th>
                  <th className="px-4 py-3">Sistema operativo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {DEVICES.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-purple-900/40 hover:bg-purple-950/40"
                  >
                    <td className="px-4 py-3 align-top text-gray-200">
                      <div className="font-semibold">
                        {d.roomName ?? `Sala ${d.roomId}`}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        PC #{d.pcNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top text-gray-200">
                      <div className="font-semibold">{d.name}</div>
                      {d.hostname && (
                        <div className="text-[11px] text-gray-400">
                          Hostname: {d.hostname}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top text-gray-300">
                      <code className="rounded bg-black/60 px-2 py-1 text-[11px] text-purple-200">
                        {d.id}
                      </code>
                    </td>

                    <td className="px-4 py-3 align-top text-gray-300">
                      {d.operatingSystem ?? "N/D"}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <StatusBadge status={d.status} />
                    </td>

                    <td className="px-4 py-3 align-top">
                      <button
                        onClick={() => handleAttack(d.id)}
                        disabled={runningTarget === d.id}
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                          runningTarget === d.id
                            ? "cursor-not-allowed border-purple-700 bg-purple-900/60 text-purple-200 opacity-70"
                            : "border-purple-500 bg-purple-700/60 text-purple-100 hover:border-purple-300 hover:bg-purple-500/80"
                        }`}
                      >
                        {runningTarget === d.id
                          ? "Lanzando..."
                          : "Lanzar ataque"}
                      </button>
                    </td>
                  </tr>
                ))}

                {DEVICES.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No hay computadores registrados para las pruebas de
                      ataque.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Badge de estado (ONLINE / OFFLINE / ERROR)
 */
function StatusBadge({ status }: { status: DeviceStatus }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

  if (status === "ONLINE") {
    return (
      <span className={`${base} bg-emerald-900/50 text-emerald-300`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
        ONLINE
      </span>
    );
  }

  if (status === "ERROR") {
    return (
      <span className={`${base} bg-red-900/50 text-red-300`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-400" />
        ERROR
      </span>
    );
  }

  return (
    <span className={`${base} bg-slate-800/70 text-slate-200`}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
      OFFLINE
    </span>
  );
}
