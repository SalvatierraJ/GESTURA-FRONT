import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";

// Opciones de carreras (puedes reemplazar por tus datos reales)
const CARRERAS = [
  { label: "Ingeniería de Sistemas", value: "sistemas" },
  { label: "Ingeniería Industrial", value: "industrial" },
  { label: "Ingeniería Electrónica", value: "electronica" },
  { label: "Ingeniería Civil", value: "civil" },
  { label: "Contaduría Pública", value: "contaduria" },
  { label: "Derecho", value: "derecho" },
];

export default function ModalRegistrarArea() {
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [touched, setTouched] = useState(false);
  const toast = useRef(null);

  const onRegistrar = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!nombre.trim()) return;
    toast.current.show({
      severity: "success",
      summary: "Área registrada",
      detail: `Se registró el área: ${nombre} en carreras: ${carreras.map(c=>CARRERAS.find(o=>o.value===c)?.label).join(", ")}`,
    });
    setVisible(false);
    setNombre("");
    setCarreras([]);
    setTouched(false);
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
        <i className="pi pi-map-marker text-2xl text-white" />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          Registrar Área
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Button
        icon="pi pi-plus"
        label="Registrar Área"
        onClick={() => setVisible(true)}
        className="mb-4 px-6 py-3 font-bold rounded-full text-lg border-none"
        style={{ background: "#e11d1d", color: "#fff" }}
      />

      <Dialog
        header={header}
        visible={visible}
        style={{ width: "400px", maxWidth: "95vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-none rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-6"
          onSubmit={onRegistrar}
        >
          {/* Input Nombre de Área */}
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
            />
            {touched && !nombre.trim() && (
              <small className="text-[#e11d1d]">
                El nombre del área es obligatorio.
              </small>
            )}
          </div>

          {/* Select múltiple de carreras */}
          <div>
            <label className="block text-black font-semibold mb-2">
              Carreras asociadas <span className="text-[#e11d1d]">*</span>
            </label>
            <MultiSelect
              value={carreras}
              options={CARRERAS}
              onChange={(e) => setCarreras(e.value)}
              placeholder="Seleccione una o más carreras"
              display="chip"
              className="w-full border-black rounded"
              style={{ minWidth: "100%" }}
              filter
            />
            {touched && carreras.length === 0 && (
              <small className="text-[#e11d1d]">
                Debe seleccionar al menos una carrera.
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
              onClick={() => setVisible(false)}
            />
            <Button
              type="submit"
              label="Registrar"
              icon="pi pi-check"
              className="font-semibold border-none"
              style={{
                background: "#e11d1d",
                color: "#fff",
                boxShadow: "0 2px 12px -2px #e11d1d44",
              }}
              disabled={!nombre.trim() || carreras.length === 0}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
