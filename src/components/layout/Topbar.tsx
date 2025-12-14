"use client";

import { useAuth } from "@/src/contexts/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "10px 20px", backgroundColor: "#ddd", display: "flex", justifyContent: "space-between" }}>
      <h1>Dashboard</h1>
      <div>
        <span>{user?.email}</span>
        <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
      </div>
    </div>
  );
}
