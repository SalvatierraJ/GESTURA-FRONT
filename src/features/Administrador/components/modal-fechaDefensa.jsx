import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";

export default function ModalAsignarDefensaSorteo({
  estudianteIds = [],
  triggerLabel,
  triggerIcon,
  disabled = false,
  onSubmit, // función que recibirá {fechaHora, sorteaArea, sorteaCaso, estudianteIds}
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [fechaHora, setFechaHora] = useState("");
  const [sorteaArea, setSorteaArea] = useState(false);
  const [sorteaCaso, setSorteaCaso] = useState(false);

  const reset = () => {
    setVisible(false);
    setFechaHora("");
    setSorteaArea(false);
    setSorteaCaso(false);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!fechaHora) return;
    if (onSubmit) {
      onSubmit({
        fechaHora,
        sorteaArea,
        sorteaCaso,
        estudianteIds,
      });
    }
    reset();
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

          {/* Botones */}
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
      </Dialog>
    </>
  );
}
