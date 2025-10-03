import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { enviarNotificacionEstudiantes } from "@/services/notificaciones.services";
import { toast } from "react-hot-toast";

export default function ModalNotificarEstudiantes({
  visible,
  onHide,
  estudiantes,
  materia,
  turno,
  semestreMateria = 1,
  loading = false,
  onSuccess
}) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!mensaje.trim()) {
      toast.error("Por favor ingresa un mensaje");
      return;
    }

    setEnviando(true);
    try {
      const response = await enviarNotificacionEstudiantes(estudiantes, mensaje);
      console.log("Respuesta del servidor:", response);
      
      // El endpoint devuelve { total, enviados, fallidos, resultados }
      if (response && typeof response === 'object' && 'total' in response) {
        const { total, enviados, fallidos, resultados } = response;
        
        if (enviados > 0) {
          // Mostrar éxito con detalles
          if (fallidos > 0) {
            toast.success(`${enviados} de ${total} notificaciones enviadas exitosamente. ${fallidos} fallaron.`, {
              duration: 5000
            });
          } else {
            toast.success(`Todas las notificaciones enviadas exitosamente (${enviados}/${total})`, {
              duration: 4000
            });
          }
          
          // Cerrar modal solo si al menos una se envió
          setMensaje("");
          onSuccess?.();
          onHide();
        } else {
          // Todas fallaron - mostrar detalles de errores
          const errores = resultados?.filter(r => !r.enviado) || [];
          const erroresUnicos = [...new Set(errores.map(e => e.error))];
          
          let mensajeError = `No se pudo enviar ninguna notificación (${fallidos}/${total} fallaron).`;
          if (erroresUnicos.length > 0) {
            mensajeError += ` Errores: ${erroresUnicos.join(', ')}.`;
          }
          
          toast.error(mensajeError, {
            duration: 8000
          });
        }
      } else if (response && response.success === false) {
        // Respuesta con formato de error estándar
        toast.error(response.message || "Error al enviar notificación");
      } else {
        // Respuesta inesperada
        toast.error("Error: Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar notificación. Verifica tu conexión.");
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    setMensaje("");
    onHide();
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <i className="pi pi-whatsapp text-green-600 text-xl"></i>
          <span className="text-lg font-bold text-red-800">
            Notificar Estudiantes
          </span>
        </div>
      }
      visible={visible}
      onHide={handleCancelar}
      style={{ width: "600px" }}
      modal
      className="p-dialog-header"
    >
      <div className="p-4">
        {/* Información de la materia y turno */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="pi pi-book text-red-600"></i>
            <span className="font-bold text-red-800">{materia}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="pi pi-clock text-red-600"></i>
            <span className="text-red-700">Turno: {turno}</span>
            <span className="text-gray-500">•</span>
            <span className="text-red-700">
              {estudiantes.length} estudiante{estudiantes.length !== 1 ? "s" : ""} seleccionado{estudiantes.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Lista de estudiantes */}
        <div className="mb-4">
          <h4 className="font-bold text-black mb-2">Estudiantes a notificar:</h4>
          <div className="max-h-32 overflow-y-auto bg-white border border-red-200 rounded p-3">
            {estudiantes.map((estudiante, index) => (
              <div key={estudiante.registro} className="flex items-center gap-2 py-1">
                <span className="text-sm text-gray-600">#{index + 1}</span>
                <span className="font-medium text-black">{estudiante.nombre}</span>
                <span className="text-xs text-gray-500">(Registro: {estudiante.registro})</span>
                {estudiante.semestre_actual > semestreMateria && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Rezagado
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Campo de mensaje */}
        <div className="mb-4">
          <label className="block font-bold text-black mb-2">
            Mensaje personalizado:
          </label>
          <InputTextarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe aquí el mensaje que se enviará a todos los estudiantes seleccionados..."
            rows={4}
            className="w-full"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {mensaje.length}/500 caracteres
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={handleCancelar}
            className="p-button-secondary"
            disabled={enviando}
          />
          <Button
            label={enviando ? "Enviando..." : "Enviar Notificación"}
            icon={enviando ? "pi pi-spin pi-spinner" : "pi pi-send"}
            onClick={handleEnviar}
            className="p-button-success"
            disabled={enviando || !mensaje.trim()}
            loading={enviando}
          />
        </div>
      </div>
    </Dialog>
  );
}
