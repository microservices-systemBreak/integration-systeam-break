// src/app/login/page.tsx
"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

const STORAGE_KEY = "authUser";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) return setError("Email inválido.");
    if (password.trim().length < 6) {
      return setError("La contraseña debe tener mínimo 6 caracteres.");
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ email: email.trim() })
        );
      }

      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Spline + efecto full screen */}
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.12.16/build/spline-viewer.js"
        strategy="lazyOnload"
      />

      <div className="pointer-events-none absolute inset-0">
        {/* @ts-ignore: web component Spline */}
        <spline-viewer
          url="https://prod.spline.design/gMwBBXF1gle8TFi2/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
        {/* Capa para que se vea más dramático pero sin tapar tanto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/75 to-purple-950/70" />
        {/* Glow extra */}
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/40 blur-3xl" />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Pequeño título arriba, sin mucha letra */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/50 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              System Break · Access
            </span>
          </div>

          {/* Card principal */}
          <div className="relative rounded-3xl border border-purple-400/50 bg-gradient-to-br from-black/85 via-purple-950/70 to-black/90 p-7 shadow-[0_0_55px_rgba(168,85,247,0.95)] backdrop-blur-3xl">
            {/* Borde glow interior */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl border border-purple-500/20" />

            {/* Encabezado dentro de la card */}
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Bienvenido a System Break
              </h1>
              <p className="mt-2 text-xs text-gray-300">
                Ingresa para monitorear tus salas y computadores.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={onSubmit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs text-gray-200">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuemail@empresa.com"
                  className="w-full rounded-xl border border-purple-800/70 bg-black/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-200">
                  Contraseña
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-purple-800/70 bg-black/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_35px_rgba(192,132,252,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
