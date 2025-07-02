import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";

// Opciones de áreas (puedes cargar dinámicamente)
const AREAS = [
  { label: "Matemáticas", value: "matematicas" },
  { label: "Física", value: "fisica" },
  { label: "Ingeniería de Software", value: "software" },
  { label: "Redes", value: "redes" },
  { label: "Inteligencia Artificial", value: "ia" },
  { label: "Bases de Datos", value: "bd" },
];

export default function ModalRegistrarDocente() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    ci: "",
    areas: [],
  });
  const [touched, setTouched] = useState({});
  const toast = useRef(null);

  // Validaciones
  const errors = {};
  if (touched.nombre && !form.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (touched.apellido1 && !form.apellido1.trim()) errors.apellido1 = "El primer apellido es obligatorio.";
  if (touched.correo && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())) errors.correo = "Correo inválido.";
  if (touched.correo && !form.correo.trim()) errors.correo = "El correo es obligatorio.";
  if (touched.areas && (!form.areas || form.areas.length === 0)) errors.areas = "Debe seleccionar al menos un área.";

  const handleInput = (name, value) => {
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["nombre", "apellido1", "correo", "areas"];
    const touchedAll = Object.fromEntries(requiredFields.map(f => [f, true]));
    setTouched({ ...touched, ...touchedAll });
    // Si hay errores, no continuar
    if (
      !form.nombre.trim() ||
      !form.apellido1.trim() ||
      !form.correo.trim() ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim()) ||
      !form.areas.length
    ) return;

    // Simular registro (puedes reemplazar por tu lógica)
    toast.current.show({
      severity: "success",
      summary: "Docente registrado",
      detail: `Se registró a: ${form.nombre} ${form.apellido1}`,
    });
    setVisible(false);
    setForm({
      nombre: "",
      apellido1: "",
      apellido2: "",
      correo: "",
      ci: "",
      areas: [],
    });
    setTouched({});
  };

  // Header minimalista
  const header = (
    <div
      className="flex items-center rounded-t-2xl justify-between px-6 py-4"
           style={{
        width: "120%",
        background: "rgb(225, 29, 29)",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-26px",
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-user-plus text-2xl text-white" />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          Registrar Docente
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Button
        icon="pi pi-user-plus"
        label="Registrar Docente"
        onClick={() => setVisible(true)}
        className="mb-4 px-6 py-3 font-bold rounded-full text-lg border-none"
        style={{ background: "#e11d1d", color: "#fff" }}
      />

      <Dialog
        header={header}
        visible={visible}
        style={{ width: "500px", maxWidth: "97vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-black font-semibold mb-1">
              Nombre <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.nombre}
              onChange={e => handleInput("nombre", e.target.value)}
              className={`w-full border-black rounded ${errors.nombre ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
              autoFocus
              placeholder="Nombre(s)"
            />
            {errors.nombre && <small className="text-[#e11d1d]">{errors.nombre}</small>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Primer Apellido <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.apellido1}
              onChange={e => handleInput("apellido1", e.target.value)}
              className={`w-full border-black rounded ${errors.apellido1 ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, apellido1: true }))}
              placeholder="Primer apellido"
            />
            {errors.apellido1 && <small className="text-[#e11d1d]">{errors.apellido1}</small>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Segundo Apellido
            </label>
            <InputText
              value={form.apellido2}
              onChange={e => handleInput("apellido2", e.target.value)}
              className="w-full border-black rounded"
              placeholder="Segundo apellido"
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Correo <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.correo}
              onChange={e => handleInput("correo", e.target.value)}
              className={`w-full border-black rounded ${errors.correo ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, correo: true }))}
              placeholder="ejemplo@correo.com"
            />
            {errors.correo && <small className="text-[#e11d1d]">{errors.correo}</small>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              CI
            </label>
            <InputText
              value={form.ci}
              onChange={e => handleInput("ci", e.target.value)}
              className="w-full border-black rounded"
              placeholder="Carnet de identidad"
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Áreas de Especialización <span className="text-[#e11d1d]">*</span>
            </label>
            <MultiSelect
              value={form.areas}
              options={AREAS}
              onChange={e => handleInput("areas", e.value)}
              className={`w-full border-black rounded ${errors.areas ? "p-invalid" : ""}`}
              panelClassName="border-black"
              display="chip"
              placeholder="Seleccione áreas"
              style={{ width: "100%" }}
              onBlur={() => setTouched(t => ({ ...t, areas: true }))}
            />
            {errors.areas && <small className="text-[#e11d1d]">{errors.areas}</small>}
          </div>
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
              disabled={
                !form.nombre.trim() ||
                !form.apellido1.trim() ||
                !form.correo.trim() ||
                !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim()) ||
                !form.areas.length
              }
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
