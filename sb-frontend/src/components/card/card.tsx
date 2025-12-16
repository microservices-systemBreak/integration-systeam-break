import React from "react";
import Link from "next/link";

interface CardProps {
  id: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  status?: "online" | "offline" | "error" | "warning";
  extraInfo?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  children,
  status,
  extraInfo,
  onClick,
  href,
  className = "",
}) => {
  // Mapeo de estados para badges y colores
  const statusConfig = {
    online: {
      label: "Online",
      dotColor: "bg-emerald-400",
      dotGlow: "shadow-[0_0_12px_rgba(52,211,153,0.9)]",
      textColor: "text-emerald-400",
    },
    offline: {
      label: "Offline",
      dotColor: "bg-gray-400",
      dotGlow: "shadow-[0_0_12px_rgba(156,163,175,0.5)]",
      textColor: "text-gray-400",
    },
    error: {
      label: "Error",
      dotColor: "bg-red-400",
      dotGlow: "shadow-[0_0_12px_rgba(248,113,113,0.9)]",
      textColor: "text-red-400",
    },
    warning: {
      label: "Warning",
      dotColor: "bg-yellow-400",
      dotGlow: "shadow-[0_0_12px_rgba(250,204,21,0.9)]",
      textColor: "text-yellow-400",
    },
  };

  // Clases base del estilo de rooms
  const baseClasses = `group relative overflow-hidden rounded-2xl border border-white/5 
                       bg-slate-900/70 p-5 backdrop-blur-md transition 
                       hover:-translate-y-1 hover:border-fuchsia-400/80 hover:bg-slate-900/95
                       ${onClick || href ? "cursor-pointer" : ""} ${className}`;

  // Contenido interno de la card
  const cardContent = (
    <>
      {/* Glow de color al hacer hover (estilo rooms) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-emerald-400/20" />
      </div>

      {/* Contenido */}
      <div className="relative flex flex-col gap-2">
        {/* Subtitle con status dot (si existe status o subtitle) */}
        {(subtitle || status) && (
          <div className="inline-flex items-center gap-2 text-[11px] text-fuchsia-300">
            {status && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusConfig[status].dotColor} ${statusConfig[status].dotGlow}`}
              />
            )}
            {subtitle || (status && statusConfig[status].label)}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Children o contenido custom */}
        {children ? (
          children
        ) : (
          <>
            {/* ExtraInfo si no hay children */}
            {extraInfo && (
              <p className="text-xs text-slate-400">{extraInfo}</p>
            )}
          </>
        )}
      </div>
    </>
  );

  // Si tiene href, usar Link
  if (href) {
    return (
      <Link href={href} className={baseClasses} id={id}>
        {cardContent}
      </Link>
    );
  }

  // Si tiene onClick o no tiene navegación, usar div
  return (
    <div onClick={onClick} className={baseClasses} id={id}>
      {cardContent}
    </div>
  );
};

export default Card;
