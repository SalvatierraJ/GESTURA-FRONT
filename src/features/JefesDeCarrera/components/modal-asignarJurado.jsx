import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";

// Opciones de jurados de ejemplo
const JURADOS = [
  { id: "1", nombre: "Carlos Gómez", area: "Redes" },
  { id: "2", nombre: "María Pérez", area: "Inteligencia Artificial" },
  { id: "3", nombre: "Juan Salazar", area: "Ingeniería de Software" },
  { id: "4", nombre: "Ana Campos", area: "Bases de Datos" },
];

export default function ModalAsignarJurados({
  estudianteIds = [],
  triggerLabel,
  triggerIcon,
  disabled = false,
  onSubmit,
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [jurados, setJurados] = useState([]);
  const [sorteo, setSorteo] = useState(false);

  const reset = () => {
    setVisible(false);
    setJurados([]);
    setSorteo(false);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!sorteo && jurados.length === 0) return;
    if (onSubmit) {
      onSubmit({
        estudianteIds,
        jurados,
        sorteo,
      });
    }
    reset();
  };

  // Header minimalista
  const header = (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        background: "#1e293b",
        borderTopLeftRadius: "18px",
        borderTopRightRadius: "18px",
      }}
    >
      <span className="text-xl font-bold text-white mx-auto">
        Asignar Jurados
      </span>
      <button
        className="text-white text-3xl font-bold opacity-80 hover:opacity-100 transition-all px-1 absolute right-5"
        style={{ lineHeight: 1 }}
        aria-label="Cerrar"
        onClick={reset}
      >
        ×
      </button>
    </div>
  );

  // Custom template para mostrar nombre y área
  const juradoTemplate = (option) => {
    // Si te pasan el id, busca el objeto
    const jurado =
      typeof option === "string"
        ? JURADOS.find((j) => j.id === option)
        : option;
    if (!jurado) return null;
    return (
      <div>
        <span className="font-semibold">{jurado.nombre}</span>
        <span className="ml-2 text-xs text-gray-600">({jurado.area})</span>
      </div>
    );
  };

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
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form
          className="flex flex-col gap-8 px-8 pt-10 pb-5"
          onSubmit={handleGuardar}
        >
          {/* Switch de sorteo */}
          <div className="flex items-center gap-3">
            <InputSwitch
              checked={sorteo}
              onChange={(e) => setSorteo(e.value)}
              className="accent-[#e11d1d]"
            />
            <label className="font-semibold text-gray-800 text-base select-none">
              Sorteo Automático de Jurados
            </label>
          </div>
          {sorteo && (
            <div className="text-xs text-[#e11d1d] ml-2">
              El sistema sorteará automáticamente los jurados.
            </div>
          )}

          {/* MultiSelect de jurados */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-800 mb-1">
              Seleccione Jurados <span className="text-[#e11d1d]">*</span>
            </label>
            <MultiSelect
              value={jurados}
              options={JURADOS}
              optionLabel="nombre"
              optionValue="id"
              itemTemplate={juradoTemplate}
              panelClassName="border-black"
              display="chip"
              placeholder="Selecciona uno o más jurados"
              className="w-full border-black rounded"
              disabled={sorteo}
              onChange={(e) => setJurados(e.value)}
              style={{ width: "100%" }}
              selectedItemTemplate={juradoTemplate}
            />
            {!sorteo && jurados.length === 0 && (
              <small className="text-[#e11d1d]">
                Seleccione al menos un jurado.
              </small>
            )}
          </div>

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
              label="Guardar Jurados"
              className="w-1/2 font-semibold bg-[#e11d1d] text-white border-none hover:bg-[#c00c0c]"
              disabled={!sorteo && jurados.length === 0}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
