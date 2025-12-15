import Link from "next/link";
import { ROOMS } from "@/src/config/inventory";

export default function RoomsPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>Salas</h1>
      <p style={{ opacity: 0.7 }}>Selecciona una sala para ver sus computadores.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 16, maxWidth: 600 }}>
        {ROOMS.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              padding: 16,
              textDecoration: "none",
              color: "inherit",
              background: "white",
            }}
          >
            <div style={{ fontWeight: 800 }}>{room.name}</div>
            <div style={{ opacity: 0.7, marginTop: 4 }}>
              Room ID: {room.id}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
