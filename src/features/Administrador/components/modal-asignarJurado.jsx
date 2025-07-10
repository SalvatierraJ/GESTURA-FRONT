import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import { useDefensasStore } from "@/store/defensas.store";
import { Toast } from "primereact/toast";

export default function ModalAsignarJurados({
  defensasIds = [],
  triggerLabel,
  triggerIcon,
  disabled = false,
  onSuccess,
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [selectedJurados, setSelectedJurados] = useState([]);
  const [sorteo, setSorteo] = useState(false);
  const { jurados, cargarJurados, asignarJurados, loading } =
    useDefensasStore();
  const toast = useRef(null);
  useEffect(() => {
    if (visible) cargarJurados();
  }, [visible, cargarJurados]);

  const reset = () => {
    setVisible(false);
    setSelectedJurados([]);
    setSorteo(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!sorteo && selectedJurados.length === 0) return;
      const juradoIds = sorteo
    ? []
    : selectedJurados.map(j => j.id || j.id_tribunal); 
    try {
      await asignarJurados({
        defensasIds,
        auto: sorteo,
        juradoIds, 
      });
      if (onSuccess) onSuccess();
      reset();
    } catch (err) {
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

  // Template para mostrar nombre y áreas en el select
  const juradoTemplate = (option) => {
    if (!option) return null;
    return (
      <div>
        <span className="font-semibold">
          {option.nombre_completo || option.nombre}
        </span>
        {option.areas &&
          Array.isArray(option.areas) &&
          option.areas.length > 0 && (
            <span className="ml-2 text-xs text-gray-600">
              ({option.areas.map((a) => a.nombre_area).join(", ")})
            </span>
          )}
        {option.sugerido && (
          <span className="ml-2 text-green-700 text-xs font-semibold">
            SUGERIDO
          </span>
        )}
      </div>
    );
  };

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
        disabled={disabled || defensasIds?.length === 0}
        tooltip={
          defensasIds?.length <= 0
            ? "Seleccione al menos una defensa"
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
              value={selectedJurados}
              options={jurados}
              optionLabel="nombre_completo"
              itemTemplate={juradoTemplate}
              panelClassName="border-black"
              display="chip"
              placeholder="Selecciona uno o más jurados"
              className="w-full border-black rounded"
              disabled={sorteo}
              onChange={(e) => setSelectedJurados(e.value)}
              style={{ width: "100%" }}
              selectedItemTemplate={juradoTemplate}
            />
            {!sorteo && selectedJurados.length === 0 && (
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
              disabled={(!sorteo && selectedJurados.length === 0) || loading}
              loading={loading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
