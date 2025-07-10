import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEstudiantesStore } from "@/store/estudiantes.store";
import { Toast } from "primereact/toast";
export default function ModalAsignarDefensaSorteo({
  estudianteIds = [],
  triggerLabel,
  triggerIcon,
  disabled = false,
  onSubmit,
  onSuccess,
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [sorteaArea, setSorteaArea] = useState(false);
  const [sorteaCaso, setSorteaCaso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);
  const timeoutRef = useRef();
  const toast = useRef(null);

  const { generarDefensa } = useEstudiantesStore();
  const reset = () => {
    setVisible(false);
    setFechaHora("");
    setSorteaArea(false);
    setSorteaCaso(false);
    setLoading(false);
    setResultados(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!fechaHora) return;
    setLoading(false);
    setResultados(null);

    timeoutRef.current = setTimeout(() => setLoading(true), 1500);

    try {
      const data = await generarDefensa({
        fechaHora,
        sorteaArea,
        sorteaCaso,
        estudianteIds,
        tipoDefensa: "Examen de grado Interna",
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setLoading(false);
      setResultados(data);
      if (onSubmit) onSubmit(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setLoading(false);
      setResultados(null);
      let mensaje = "Ocurrió un error inesperado";
      if (err?.response?.data?.message) {
        mensaje = err.response.data.message;
      } else if (err?.message) {
        mensaje = err.message;
      }
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: mensaje,
        life: 6000,
      });
    }
  };

  // Header minimalista y alineado
  const header = (
    <div
      className="flex items-center rounded-t-2xl  justify-between px-6 py-4"
      style={{
        width: "126%",
        background: "rgb(225, 29, 29)",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-26px",
      }}
    >
      <span className="text-xl font-bold text-white mx-auto">
        Asignar Detalles de Defensas
      </span>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <Button
        label={triggerLabel}
        icon={triggerIcon}
        onClick={() => setVisible(true)}
        className={`${
          triggerLabel
            ? "bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700"
            : "p-2 bg-transparent hover:bg-red-50 text-red-600 text-lg rounded-full"
        }`}
        style={
          triggerLabel ? { background: "#1e293b", color: "#fff" } : undefined
        }
        disabled={disabled || estudianteIds.length === 0}
        tooltip={
          estudianteIds.length <= 0
            ? "Seleccione al menos un estudiante"
            : undefined
        }
        tooltipOptions={{ position: "top" }}
      />

      <Dialog
        header={header}
        visible={visible}
        style={{ width: "410px", maxWidth: "97vw" }}
        modal
        draggable={false}
        onHide={reset}
        contentClassName="bg-white rounded-b-2xl p-0 text-white"
        className="rounded-2xl"
      >
        {/* Spinner */}
        {loading && (
          <div className="flex flex-col items-center py-10 gap-4">
            <ProgressSpinner />
            <span className="text-lg font-bold text-gray-800">
              Realizando sorteo...
            </span>
            <span className="text-gray-500 text-xs">
              Esto puede tardar algunos segundos
            </span>
          </div>
        )}

        {/* Resultados */}
        {!loading && resultados && (
          <div className="flex flex-col gap-3 px-5 py-7">
            <span className="text-lg text-center font-semibold text-green-800">
              Sorteo exitoso
            </span>
            {resultados.map((r, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 mb-2 flex flex-col gap-1"
              >
                <div>
                  <b>Estudiante:</b> {r.estudiante}
                </div>
                <div>
                  <b>Área:</b> {r.area}
                </div>
                <div>
                  <b>Caso:</b> {r.caso}
                </div>
                <div>
                  <b>Fecha:</b> {new Date(r.fecha).toLocaleString()}
                </div>
              </div>
            ))}
            <Button
              label="Cerrar"
              className="mt-2 bg-[#e11d1d] text-white font-bold border-none"
              onClick={reset}
            />
          </div>
        )}

        {/* Formulario */}
        {!loading && !resultados && (
          <form
            className="flex flex-col gap-8 px-8 pt-10 pb-5"
            onSubmit={handleGuardar}
          >
            {/* Fecha y Hora */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-800 mb-1">
                Fecha y Hora
              </label>
              <InputText
                type="datetime-local"
                className="border border-black rounded w-full px-3 py-2"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                required
              />
            </div>
            {/* Switch Sorteo de Área */}
            <div className="flex items-center gap-3">
              <InputSwitch
                checked={sorteaArea}
                onChange={(e) => setSorteaArea(e.value)}
                className="accent-[#e11d1d]"
              />
              <label className="font-semibold text-gray-800 text-base select-none">
                Sorteo de Área
              </label>
            </div>
            {sorteaArea && (
              <div className="text-xs text-[#e11d1d] ml-2">
                El área será sorteada y se notificará al estudiante.
              </div>
            )}
            {/* Switch Sorteo de Caso de Estudio */}
            <div className="flex items-center gap-3">
              <InputSwitch
                checked={sorteaCaso}
                onChange={(e) => setSorteaCaso(e.value)}
                className="accent-[#e11d1d]"
              />
              <label className="font-semibold text-gray-800 text-base select-none">
                Sorteo de Caso de Estudio
              </label>
            </div>
            {sorteaCaso && (
              <div className="text-xs text-[#e11d1d] ml-2">
                El caso de estudio será sorteado y se notificará al estudiante.
              </div>
            )}
            <div className="flex gap-5 mt-2">
              <Button
                type="button"
                label="Cancelar"
                className="w-1/2 border-2 border-black text-black font-semibold bg-white hover:bg-gray-100"
                onClick={reset}
              />
              <Button
                type="submit"
                label="Guardar Defensa"
                className="w-1/2 font-semibold bg-[#e11d1d] text-white border-none hover:bg-[#c00c0c]"
                disabled={!fechaHora}
              />
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
