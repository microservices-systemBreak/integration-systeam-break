// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const { login } = useAuth(); // Desde el contexto
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) return setError("Email inválido.");
    if (password.trim().length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");

    setSubmitting(true);
    try {
      await login(email.trim(), password);  // mock login
      router.push("/");  // Redirigir al dashboard
    } catch {
      setError("No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <form onSubmit={onSubmit} style={{ width: 360, border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>SB Management</h1>
        <p style={{ opacity: 0.7, marginTop: 6 }}>Ingresa para abrir el dashboard.</p>

        <label style={{ display: "block", marginTop: 14, fontSize: 13 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tuemail@empresa.com"
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <label style={{ display: "block", marginTop: 12, fontSize: 13 }}>Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="******"
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        {error && <p style={{ marginTop: 10, color: "#b00020", fontSize: 13 }}>{error}</p>}

        <button
          disabled={submitting}
          style={{ marginTop: 14, width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
