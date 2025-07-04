import React, { useRef, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useCasosStore } from "@/store/casos.store";

export default function ModalRegistrarCarrera({
  visible,
  setVisible,
  carrera = null,
  limpiarCarreraEditar = () => {},
}) {
  const [nombre, setNombre] = useState("");
  const [facultad, setFacultad] = useState(null);
  const [touched, setTouched] = useState(false);
  const toast = useRef(null);

  const {
    facultades: facultadesAPI,
    cargarFacultades,
    cargarCarreras,
    loading,
    nuevaCarrera,
    actualizarCarrera, // función para editar en el store
  } = useCasosStore();


  useEffect(() => {
    cargarFacultades();
  }, [cargarFacultades]);

  useEffect(() => {
    if (carrera) {
      setNombre(carrera.nombre_carrera || "");
      setFacultad(carrera.id_facultad || null);
    } else {
      setNombre("");
      setFacultad(null);
    }
    setTouched(false);
  }, [carrera, visible]);

  const limpiar = () => {
    setNombre("");
    setFacultad(null);
    setTouched(false);
    limpiarCarreraEditar();
  };

  const facultadesDropdown = (facultadesAPI || []).map((f) => ({
    label: f.nombre_facultad,
    value: f.id_facultad,
  }));

  // Modo: editar o crear
  const modoEditar = Boolean(carrera);

  const onRegistrar = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!nombre.trim() || !facultad) return;
    try {
      if (modoEditar) {
  
        await actualizarCarrera({
          id: carrera.id_carrera, 
          nombre_carrera: nombre,
          id_facultad: facultad,
        });
        cargarCarreras();
      } else {
        await nuevaCarrera({
          nombre_carrera: nombre,
          id_facultad: facultad,
        });
      }
      toast.current?.show({
        severity: "success",
        summary: modoEditar ? "Carrera actualizada" : "Carrera registrada",
        detail: modoEditar
          ? `Se actualizó la carrera: ${nombre}.`
          : `Se registró la carrera: ${nombre} en la facultad seleccionada.`,
      });
      setTimeout(() => {
        setVisible(false);
        limpiar();
      }, 600);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Ocurrió un error. Por favor, inténtelo de nuevo.",
      });
    }
  };

  // Header estilizado y alineado
  const header = (
    <div
      className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
      style={{
        width: "126%",
        background: "rgb(225, 29, 29)",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-26px",
      }}
    >
      <div className="flex items-center gap-3">
        <i
          className={
            modoEditar
              ? "pi pi-pencil text-2xl text-white"
              : "pi pi-plus text-2xl text-white"
          }
        />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          {modoEditar ? "Editar Carrera" : "Registrar Carrera"}
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={header}
        visible={visible}
        style={{ width: "400px", maxWidth: "95vw" }}
        modal
        draggable={false}
        onHide={() => {
          setVisible(false);
          limpiar();
        }}
        contentClassName="bg-none rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-6"
          onSubmit={onRegistrar}
        >
          {/* Input Nombre de Carrera */}
          <div>
            <label className="block text-black font-semibold mb-2">
              Nombre de la carrera <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full border-black rounded focus:ring-2 focus:ring-[#e11d1d] ${
                touched && !nombre.trim() ? "p-invalid" : ""
              }`}
              placeholder="Ingrese el nombre de la carrera"
              style={{ color: "#e11d1d" }}
              onBlur={() => setTouched(true)}
              autoFocus
            />
            {touched && !nombre.trim() && (
              <small className="text-[#e11d1d]">
                El nombre de la carrera es obligatorio.
              </small>
            )}
          </div>

          {/* Select de facultad */}
          <div>
            <label className="block text-black font-semibold mb-2">
              Facultad <span className="text-[#e11d1d]">*</span>
            </label>
            <Dropdown
              value={facultad}
              options={facultadesDropdown}
              onChange={(e) => setFacultad(e.value)}
              placeholder="Seleccione una facultad"
              className="w-full border-black rounded"
              style={{ color: "#e11d1d" }}
              panelClassName="bg-white border-black"
              filter
            />
            {touched && !facultad && (
              <small className="text-[#e11d1d]">
                Debe seleccionar una facultad.
              </small>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2 pb-2">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text font-semibold"
              style={{ color: "#e11d1d", border: "none" }}
              onClick={() => {
                setVisible(false);
                limpiar();
              }}
            />
            <Button
              type="submit"
              label={modoEditar ? "Guardar Cambios" : "Registrar"}
              icon={modoEditar ? "pi pi-pencil" : "pi pi-check"}
              className="font-semibold border-none"
              style={{
                background: "#e11d1d",
                color: "#fff",
                boxShadow: "0 2px 12px -2px #e11d1d44",
              }}
              disabled={!nombre.trim() || !facultad}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
