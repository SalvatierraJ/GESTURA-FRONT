// src/components/Chatbot.jsx
import React, { useRef, useState } from "react";
import { useChatbotStore } from "../store/chatbot.store";
import { enviarMensajeChat } from "../services/chatbot.services";

export default function Chatbot() {
  const {
    history,
    setHistory,
    addMessage,
    loading,
    setLoading,
    error,
    setError,
    resetChat,
  } = useChatbotStore();

  const [mensaje, setMensaje] = useState("");
  const chatEndRef = useRef(null);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    addMessage({ usuario: mensaje });
    setLoading(true);
    setError(null);
    try {
      const data = await enviarMensajeChat(mensaje);
      console.log("Respuesta del bot:", data);

      // 1. Si llega un array de history, úsalo, pero asegúrate que la respuesta del bot esté como último mensaje
      if (Array.isArray(data.history)) {
        let hist = [...data.history];
        // Si el último mensaje NO tiene bot, lo agregas (mejor aún, ¡agrega un nuevo objeto si quieres separar!)
        if (data.respuesta) {
          hist.push({ bot: data.respuesta });
        }
        setHistory(hist);
      } else if (data.respuesta) {
        // Si no hay history, agrega solo la respuesta del bot
        addMessage({ bot: data.respuesta });
      }
      setMensaje("");
    } catch (err) {
      setError("No se pudo conectar con el bot.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 rounded shadow-lg border bg-white flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b bg-red-600 rounded-t-lg">
        <h2 className="text-lg font-bold text-white">Chatbot Académico</h2>
        <button className="text-white hover:text-red-200" onClick={resetChat}>
          Limpiar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {history.length === 0 && (
          <div className="text-center text-gray-400">
            ¡Hola! ¿En qué puedo ayudarte hoy?
          </div>
        )}
        {history.map((msg, idx) =>
          msg.usuario ? (
            <div key={idx} className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
                {msg.usuario}
              </div>
            </div>
          ) : msg.bot ? (
            <div key={idx} className="flex justify-start">
              <div className="bg-gray-200 text-black rounded-lg px-4 py-2 max-w-xs">
                {msg.bot}
              </div>
            </div>
          ) : null
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={enviar} className="p-4 border-t flex gap-2 bg-white">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>
      {error && <div className="text-red-600 text-center py-1">{error}</div>}
    </div>
  );
}
