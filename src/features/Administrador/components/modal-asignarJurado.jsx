import React, { useEffect, useState, useRef, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import { useDefensasStore } from "@/store/defensas.store";
import { Toast } from "primereact/toast";

function normalizar(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function ModalAsignarJurados({
  defensasIds = [],
  triggerLabel,
  triggerIcon,
  disabled = false,
  onSuccess,
  className = "",
  juradosBool,
  Jurados,
  TituloModal,
 
  areaNombre,          
  defensa               
}) {
  const [visible, setVisible] = useState(false);
  const [selectedJurados, setSelectedJurados] = useState([]);
  const [sorteo, setSorteo] = useState(false);
  const [saving, setSaving] = useState(false);
  const { jurados, cargarJurados, asignarJurados, actualizarJurados } = useDefensasStore();
  const toast = useRef(null);

  // Derivar nombre de área objetivo
  const targetArea = useMemo(() => {
    // prioridad: prop directa; si no, intenta desde defensa
    const fromDefensa =
      defensa?.area?.nombre ??
      defensa?.area_nombre ??
      defensa?.nombre_area ??
      defensa?.Area?.nombre;
    return (areaNombre || fromDefensa || "").toString();
  }, [areaNombre, defensa]);

  const targetAreaNorm = useMemo(() => normalizar(targetArea), [targetArea]);

  useEffect(() => {
    if (visible) cargarJurados();
  }, [visible, cargarJurados]);

  // Filtrado por área
  const filteredJurados = useMemo(() => {
    if (!targetAreaNorm) return jurados || [];
    const juradosArr = Array.isArray(jurados) ? jurados : [];
    return juradosArr.filter((j) => {
      const areas = Array.isArray(j.areas) ? j.areas : [];
      return areas.some((a) => normalizar(a?.nombre_area) === targetAreaNorm);
    });
  }, [jurados, targetAreaNorm]);

  // Avisos según filtro/área
  useEffect(() => {
    if (!visible) return;

    if (!targetArea) {
      toast.current?.show({
        severity: "info",
        summary: "Sin área especificada",
        detail: "No se recibió área. Se muestran todos los docentes.",
        life: 4000,
      });
    } else if (targetArea && filteredJurados.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "No hay coincidencias",
        detail: `No se encontraron docentes para el área "${targetArea}".`,
        life: 5000,
      });
    }
  }, [visible, targetArea, filteredJurados.length]);

  // Preselección respetando el filtro
  useEffect(() => {
    if (!visible) return;

    if (Jurados) {
      const juradosAsignados = [];
      Object.values(Jurados).forEach((juradosDeDefensa) => {
        if (Array.isArray(juradosDeDefensa)) {
          juradosAsignados.push(...juradosDeDefensa);
        }
      });

      const juradosUnicos = juradosAsignados.filter((jurado, index, self) =>
        index === self.findIndex(
          (j) => (j.id || j.id_tribunal) === (jurado.id || jurado.id_tribunal)
        )
      );

      // Buscar en la lista FILTRADA (para no preseleccionar fuera del área)
      const preselected = juradosUnicos
        .map((juradoAsignado) =>
          filteredJurados.find(
            (juradoDisponible) =>
              (juradoDisponible.id || juradoDisponible.id_tribunal) ===
                (juradoAsignado.id || juradoAsignado.id_tribunal) ||
              juradoDisponible.nombre_completo === juradoAsignado.nombre ||
              juradoDisponible.nombre === juradoAsignado.nombre
          )
        )
        .filter(Boolean);

      setSelectedJurados(preselected);
    } else {
      setSelectedJurados([]);
    }
  }, [visible, Jurados, filteredJurados]);

  const reset = () => {
    setVisible(false);
    setSelectedJurados([]);
    setSorteo(false);
    setSaving(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!sorteo && selectedJurados.length === 0) return;
    setSaving(true);
    const juradoIds = sorteo ? [] : selectedJurados.map((j) => j.id || j.id_tribunal);
    try {
      if (!juradosBool) {
        await asignarJurados({
          defensasIds,
          auto: sorteo,
          juradoIds,
        });
      } else {
        await actualizarJurados(defensasIds, juradoIds);
      }

      reset();
      onSuccess && onSuccess();
    } catch (err) {
      let mensaje = "Ocurrió un error inesperado";
      if (err?.response?.data?.message) mensaje = err.response.data.message;
      else if (err?.message) mensaje = err.message;

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: mensaje,
        life: 6000,
      });
      setSaving(false);
    }
  };

  const header = (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        background: "#1e293b",
        borderTopLeftRadius: "18px",
        borderTopRightRadius: "18px",
      }}
    >
      <span className="text-xl font-bold text-white mx-auto">{TituloModal}</span>
      <button
        className="text-white text-3xl font-bold opacity-80 hover:opacity-100 transition-all px-1 Nosolute right-5"
        style={{ lineHeight: 1 }}
        aria-label="Cerrar"
        onClick={reset}
        disabled={saving}
      >
        ×
      </button>
    </div>
  );

  const juradoTemplate = (option) => {
    if (!option) return null;
    return (
      <div>
        <span className="font-semibold">
          {option.nombre_completo || option.nombre}
        </span>
        {option.areas && Array.isArray(option.areas) && option.areas.length > 0 && (
          <span className="ml-2 text-xs text-gray-600">
            ({option.areas.map((a) => a?.nombre_area).join(", ")})
          </span>
        )}
        {option.sugerido && (
          <span className="ml-2 text-green-700 text-xs font-semibold">SUGERIDO</span>
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
        } ${className}`}
        style={triggerLabel ? { background: "#1e293b", color: "#fff" } : undefined}
        disabled={disabled || defensasIds?.length === 0}
        tooltip={defensasIds?.length <= 0 ? "Seleccione al menos una defensa" : undefined}
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
        <div className="relative">
          {saving && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
              <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mb-2" />
              <span className="text-[#e11d1d] text-lg font-semibold">Guardando jurados...</span>
            </div>
          )}

          <form className="flex flex-col gap-8 px-8 pt-10 pb-5" onSubmit={handleGuardar}>
            <div className="flex items-center gap-3">
              {TituloModal !== "Editar Jurados" && (
                <>
                  <InputSwitch
                    checked={sorteo}
                    onChange={(e) => setSorteo(e.value)}
                    className="accent-[#e11d1d]"
                    disabled={saving}
                  />
                  <label className="font-semibold text-gray-800 text-base select-none">
                    Sorteo Automático de Jurados
                  </label>
                </>
              )}
            </div>

            {sorteo && (
              <div className="text-xs text-[#e11d1d] ml-2">
                El sistema sorteará automáticamente los jurados.
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-800 mb-1">
                Seleccione Jurados <span className="text-[#e11d1d]">*</span>
                {targetArea && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Área: {targetArea})
                  </span>
                )}
              </label>

              <MultiSelect
                value={selectedJurados}
                options={filteredJurados}
                optionLabel="nombre_completo"
                itemTemplate={juradoTemplate}
                panelClassName="border-black"
                display="chip"
                placeholder={
                  targetArea ? "Docentes del área filtrada" : "Selecciona uno o más jurados"
                }
                className="w-full border-black rounded"
                disabled={sorteo || saving}
                onChange={(e) => setSelectedJurados(e.value)}
                style={{ width: "100%" }}
                selectedItemTemplate={juradoTemplate}
              />

              {!sorteo && selectedJurados.length === 0 && (
                <small className="text-[#e11d1d]">Seleccione al menos un jurado.</small>
              )}
            </div>

            <div className="flex gap-5 mt-2">
              <Button
                type="button"
                label="Cancelar"
                className="w-1/2 border-2 border-black text-black font-semibold bg-white hover:bg-gray-100"
                onClick={reset}
                disabled={saving}
              />
              <Button
                type="submit"
                label="Guardar Jurados"
                className="w-1/2 font-semibold bg-[#e11d1d] text-white border-none hover:bg-[#c00c0c]"
                disabled={(!sorteo && selectedJurados.length === 0) || saving}
                loading={saving}
              />
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}
