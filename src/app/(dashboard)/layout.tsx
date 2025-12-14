"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import DashboardShell from "@/src/components/layout/DashboardShell";  // Para tener el layout básico

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");  // Si no hay sesión, redirige a login
  }, [loading, isAuthenticated, router]);

  if (loading) return <p style={{ padding: 16 }}>Cargando...</p>;
  if (!isAuthenticated) return null;

  return (
    <DashboardShell>
      {children} {/* Esto es lo que va a renderizar en cada página del dashboard */}
    </DashboardShell>
  );
}
