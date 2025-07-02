import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

// Opciones de carreras (ajusta según tus carreras)
const CARRERAS = [
  { label: "Ingeniería de Sistemas", value: "sistemas" },
  { label: "Ingeniería Industrial", value: "industrial" },
  { label: "Ingeniería Civil", value: "civil" },
  { label: "Ingeniería Electrónica", value: "electronica" },
  { label: "Contaduría Pública", value: "contaduria" },
  { label: "Derecho", value: "derecho" },
];

export default function ModalRegistrarEstudiante() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telefono: "",
    ci: "",
    carrera: null,
    registro: "",
  });
  const [touched, setTouched] = useState({});
  const toast = useRef(null);

  // Validaciones
  const errors = {};
  if (touched.nombre && !form.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
  if (touched.apellido1 && !form.apellido1.trim()) errors.apellido1 = "El primer apellido es obligatorio.";
  if (touched.correo && !form.correo.trim()) errors.correo = "El correo es obligatorio.";
  if (touched.correo && form.correo && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())) errors.correo = "Correo inválido.";
  if (touched.telefono && form.telefono && !/^\d{7,15}$/.test(form.telefono)) errors.telefono = "Teléfono inválido.";
  if (touched.carrera && !form.carrera) errors.carrera = "Seleccione la carrera.";
  if (touched.registro && !form.registro.trim()) errors.registro = "El número de registro es obligatorio.";

  const handleInput = (name, value) => {
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["nombre", "apellido1", "correo", "carrera", "registro"];
    const touchedAll = Object.fromEntries(requiredFields.map(f => [f, true]));
    setTouched({ ...touched, ...touchedAll });

    if (
      !form.nombre.trim() ||
      !form.apellido1.trim() ||
      !form.correo.trim() ||
      !form.carrera ||
      !form.registro.trim() ||
      (form.correo && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())) ||
      (form.telefono && !/^\d{7,15}$/.test(form.telefono))
    ) return;

    toast.current.show({
      severity: "success",
      summary: "Estudiante registrado",
      detail: `${form.nombre} ${form.apellido1} - ${CARRERAS.find(c => c.value === form.carrera)?.label}`,
    });
    setVisible(false);
    setForm({
      nombre: "",
      apellido1: "",
      apellido2: "",
      correo: "",
      telefono: "",
      ci: "",
      carrera: null,
      registro: "",
    });
    setTouched({});
  };

  // Header minimalista y alineado
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
          Registrar Estudiante
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Button
        icon="pi pi-user-plus"
        label="Nuevo"
        onClick={() => setVisible(true)}
        className="mb-4 px-5 py-3 font-bold rounded-full text-lg border-none"
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
        <form className="px-7 pt-6 pb-3 flex flex-col gap-5" onSubmit={handleSubmit}>
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
              Número de Teléfono
            </label>
            <InputText
              value={form.telefono}
              onChange={e => handleInput("telefono", e.target.value)}
              className={`w-full border-black rounded ${errors.telefono ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, telefono: true }))}
              placeholder="Ej: 78912345"
              maxLength={15}
            />
            {errors.telefono && <small className="text-[#e11d1d]">{errors.telefono}</small>}
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
              Carrera <span className="text-[#e11d1d]">*</span>
            </label>
            <Dropdown
              value={form.carrera}
              options={CARRERAS}
              onChange={e => handleInput("carrera", e.value)}
              className={`w-full border-black rounded ${errors.carrera ? "p-invalid" : ""}`}
              placeholder="Seleccione una carrera"
              onBlur={() => setTouched(t => ({ ...t, carrera: true }))}
              filter
              showClear
            />
            {errors.carrera && <small className="text-[#e11d1d]">{errors.carrera}</small>}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Número de Registro <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.registro}
              onChange={e => handleInput("registro", e.target.value)}
              className={`w-full border-black rounded ${errors.registro ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, registro: true }))}
              placeholder="Número de registro universitario"
            />
            {errors.registro && <small className="text-[#e11d1d]">{errors.registro}</small>}
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
                !form.carrera ||
                !form.registro.trim() ||
                (form.correo && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())) ||
                (form.telefono && !/^\d{7,15}$/.test(form.telefono))
              }
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
