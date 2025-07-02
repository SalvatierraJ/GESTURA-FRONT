import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";

const ROLES = [
  { label: "Administrador", value: "Admin" },
  { label: "Jefe de Carrera", value: "Jefe" },
  { label: "Docente", value: "Docente" },
  { label: "Estudiante", value: "Estudiante" },
];

export default function ModalRegistrarUsuario({ onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    roles: [],
  });
  const [touched, setTouched] = useState({});

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
    setTouched({ ...touched, [key]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ nombre: true, correo: true, password: true, roles: true });
    if (
      !form.nombre.trim() ||
      !form.correo.trim() ||
      !form.password.trim() ||
      form.roles.length === 0
    )
      return;
    if (onSubmit) onSubmit(form);
    setVisible(false);
    setForm({
      nombre: "",
      correo: "",
      password: "",
      roles: [],
    });
    setTouched({});
  };

  const header = (
    <div
      className="flex items-center rounded-t-2xl justify-between px-6 py-4"
      style={{
        width: "124%",
        background: "rgb(225, 29, 29)",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-25px",
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-user-plus text-2xl text-white" />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          Registrar Usuario
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        icon="pi pi-user-plus"
        label="Registrar Usuario"
        onClick={() => setVisible(true)}
        className="mb-4 px-6 py-3 font-bold rounded-full text-lg border-none"
        style={{ background: "#e11d1d", color: "#fff" }}
      />
      <Dialog
        header={header}
        visible={visible}
        style={{ width: "430px", maxWidth: "97vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-black font-semibold mb-1">
              Nombre <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.nombre}
              onChange={e => handleInput("nombre", e.target.value)}
              className={`w-full border-black rounded ${touched.nombre && !form.nombre.trim() ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
              placeholder="Nombre completo"
              autoFocus
            />
            {touched.nombre && !form.nombre.trim() && (
              <small className="text-[#e11d1d]">El nombre es obligatorio.</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Correo <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.correo}
              onChange={e => handleInput("correo", e.target.value)}
              className={`w-full border-black rounded ${touched.correo && !form.correo.trim() ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, correo: true }))}
              placeholder="ejemplo@correo.com"
            />
            {touched.correo && !form.correo.trim() && (
              <small className="text-[#e11d1d]">El correo es obligatorio.</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Contraseña <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.password}
              onChange={e => handleInput("password", e.target.value)}
              className={`w-full border-black rounded ${touched.password && !form.password.trim() ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              placeholder="Contraseña"
              type="password"
            />
            {touched.password && !form.password.trim() && (
              <small className="text-[#e11d1d]">La contraseña es obligatoria.</small>
            )}
          </div>

          {/* Select de roles */}
          <div>
            <label className="block text-black font-semibold mb-1">
              Roles <span className="text-[#e11d1d]">*</span>
            </label>
            <MultiSelect
              value={form.roles}
              options={ROLES}
              onChange={e => handleInput("roles", e.value)}
              optionLabel="label"
              placeholder="Selecciona uno o más roles"
              className={`w-full border-black rounded ${touched.roles && form.roles.length === 0 ? "p-invalid" : ""}`}
              display="chip"
              panelClassName="border-black"
            />
            {touched.roles && form.roles.length === 0 && (
              <small className="text-[#e11d1d]">Selecciona al menos un rol.</small>
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
                !form.correo.trim() ||
                !form.password.trim() ||
                form.roles.length === 0
              }
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
