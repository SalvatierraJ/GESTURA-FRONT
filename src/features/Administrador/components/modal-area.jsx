// src/features/Administrador/components/modal-area.jsx
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useCasosStore } from "@/store/casos.store";

export default function RegistrarArea({
  visible,
  setVisible,
  areaEditar,
  onSuccess,
}) {
  const [nombre, setNombre] = useState("");
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);
  const toast = useRef(null);

  const {
    carreras,
    nuevaAreaEstudio,
    actualizarAreaEstudio,
    cargarAreasEstudio,
  } = useCasosStore();

  useEffect(() => {
    if (areaEditar) {
      setNombre(areaEditar.nombre_area);

      const ids = (areaEditar.carreras ?? [])
        .map((nombre) => {
          const encontrada = carreras.find((c) => c.nombre_carrera === nombre);
          return encontrada ? encontrada.id_carrera : null;
        })
        .filter(Boolean);

      setCarrerasSeleccionadas(ids);
    } else {
      setNombre("");
      setCarrerasSeleccionadas([]);
    }
    setTouched(false);
  }, [areaEditar, carreras, visible]);

  const carrerasDropdown = (carreras || []).map((c) => ({
    label: c.nombre_carrera,
    value: c.id_carrera,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!nombre.trim() || carrerasSeleccionadas.length === 0) return;
    setSaving(true);
    try {
      if (areaEditar) {
        await actualizarAreaEstudio({
          id: areaEditar.id_area,
          nombre_area: nombre,
          carreraIds: carrerasSeleccionadas,
        });
        toast.current.show({
          severity: "success",
          summary: "Área actualizada",
        });
      } else {
        // Modo creación
        await nuevaAreaEstudio({
          nombre_area: nombre,
          carreraIds: carrerasSeleccionadas,
        });
        toast.current.show({ severity: "success", summary: "Área registrada" });
      }
      setVisible(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "No se pudo guardar el área.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={areaEditar ? "Editar Área" : "Registrar Área"}
        visible={visible}
        style={{ width: "400px", maxWidth: "95vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-none rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <div className="relative">
          {saving && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
              <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mr-3" />
              <span className="text-[#e11d1d] text-lg font-semibold">
                Guardando área...
              </span>
            </div>
          )}

          <form
            className="px-7 pt-6 pb-3 flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-black font-semibold mb-2">
                Nombre del área <span className="text-[#e11d1d]">*</span>
              </label>
              <InputText
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full border-black rounded focus:ring-2 focus:ring-[#e11d1d] ${
                  touched && !nombre.trim() ? "p-invalid" : ""
                }`}
                placeholder="Ingrese el nombre del área"
                style={{ color: "#e11d1d" }}
                onBlur={() => setTouched(true)}
                autoFocus
                disabled={saving}
              />
              {touched && !nombre.trim() && (
                <small className="text-[#e11d1d]">
                  El nombre del área es obligatorio.
                </small>
              )}
            </div>

            <div>
              <label className="block text-black font-semibold mb-2">
                Carreras asociadas <span className="text-[#e11d1d]">*</span>
              </label>
              <MultiSelect
                value={carrerasSeleccionadas}
                options={carrerasDropdown}
                onChange={(e) => setCarrerasSeleccionadas(e.value)}
                placeholder="Seleccione una o más carreras"
                display="chip"
                className="w-full border-black rounded"
                style={{ minWidth: "100%" }}
                filter
                loading={carrerasDropdown.length === 0}
                disabled={saving}
              />
              {touched && carrerasSeleccionadas.length === 0 && (
                <small className="text-[#e11d1d]">
                  Debe seleccionar al menos una carrera.
                </small>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2 pb-2">
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text font-semibold"
                style={{ color: "#e11d1d", border: "none" }}
                onClick={() => setVisible(false)}
                disabled={saving}
              />
              <Button
                type="submit"
                label={areaEditar ? "Actualizar" : "Registrar"}
                icon="pi pi-check"
                className="font-semibold border-none"
                loading={saving}
                style={{
                  background: "#e11d1d",
                  color: "#fff",
                  boxShadow: "0 2px 12px -2px #e11d1d44",
                }}
                disabled={
                  saving || !nombre.trim() || carrerasSeleccionadas.length === 0
                }
              />
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}
