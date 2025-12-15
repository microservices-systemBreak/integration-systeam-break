import React from "react";

// Definimos los colores para cada estado
const statusStyles: Record<string, React.CSSProperties> = {
  online: { backgroundColor: "#e6f4ea", color: "#0b8043" },  // Verde claro
  offline: { backgroundColor: "#f1f3f4", color: "#5f6368" }, // Gris claro
  error: { backgroundColor: "#fdecea", color: "#c5221f" },   // Rojo claro
};

interface CardProps {
  title: string;
  content: string;
  id: string;
  status: "online" | "offline" | "error";
  extraInfo?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  status,
  extraInfo,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #eee",
        cursor: "pointer",
        transition: "transform 0.3s ease, background-color 0.3s",  // Transición suave
        backgroundColor: "#2c2c2c",  // Fondo oscuro para mayor contraste
      }}
      className="hover:scale-105 hover:bg-slate-900/90 transition duration-200"
    >
      <div style={{ fontWeight: 800, fontSize: "16px", color: "#f3f3f3" }}>
        {title}
      </div>
      <div style={{ opacity: 0.8, fontSize: "14px", color: "#ddd" }}>
        {content}
      </div>
      {extraInfo && (
        <div style={{ fontSize: 12, opacity: 0.75, color: "#aaa" }}>
          {extraInfo}
        </div>
      )}
      <div
        style={{
          padding: "4px 8px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          ...statusStyles[status],
          marginTop: 8,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default Card;
