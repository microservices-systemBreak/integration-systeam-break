"use client";

import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function ChatIAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hola, soy tu asistente de IA. ¿En qué puedo ayudarte con System Break?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simular respuesta de IA después de un breve delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Entendido. ¿Qué más quieres revisar?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05020b] text-slate-50 overflow-hidden">
      {/* FONDO SPLINE (opcional, para consistencia) */}
      <div className="pointer-events-none absolute inset-0 opacity-45">
        {/* @ts-ignore: Web Component de Spline */}
        <spline-viewer
          url="https://prod.spline.design/NEQBXr1i0Otgs9Nn/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      {/* CONTENIDO */}
      <div className="relative mx-auto flex max-w-4xl flex-col h-screen px-6 py-8">
        {/* Header */}
        <header className="mb-6 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400/90">
            System Break · Chat IA
          </p>
          <h1 className="text-3xl font-black sm:text-4xl">Chat IA</h1>
          <p className="max-w-xl text-sm text-slate-200/80">
            Asistente inteligente para ayudarte con el monitoreo y análisis de System Break.
          </p>
        </header>

        {/* Panel de mensajes */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-md transition ${
                  message.role === "user"
                    ? "bg-fuchsia-600/80 text-white border border-fuchsia-400/50"
                    : "bg-slate-900/70 text-slate-50 border border-white/5 hover:border-fuchsia-400/30"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                <div
                  className={`text-[10px] mt-2 ${
                    message.role === "user" ? "text-fuchsia-200/70" : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="w-full rounded-2xl border border-white/5 bg-slate-900/70 p-4 
                         backdrop-blur-md text-slate-50 placeholder:text-slate-400
                         focus:outline-none focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20
                         transition"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="rounded-2xl bg-fuchsia-600 px-6 py-4 text-sm font-semibold text-white
                       shadow-lg shadow-fuchsia-600/40 transition 
                       hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-fuchsia-600"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

