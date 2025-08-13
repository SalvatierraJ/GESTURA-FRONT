import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useCasosStore } from "@/store/casos.store";
import { useEstudiantesStore } from "@/store/estudiantes.store";

export default function ModalRegistrarEstudiante({
  visible,
  setVisible,
  estudianteEditar = null,
  onSuccess,
}) {


  const [saving, setSaving] = useState(false);

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

  const { carreras, cargarCarreras } = useCasosStore();
  const { crearEstudiantes, editarEstudiante } = useEstudiantesStore();
    const carrerasDropdown = (carreras || []).map((c) => ({
    label: c.nombre_carrera,
    value: Number(c.id_carrera),
  }));
  useEffect(() => {
    if (visible && !carreras?.length) {
      cargarCarreras(1, 1000);
    }
  }, [visible, carreras?.length]);

  useEffect(() => {
    if (!visible) return;

    if (estudianteEditar) {
      setForm({
        nombre: estudianteEditar.nombre ?? "",
        apellido1: estudianteEditar.apellido1 ?? "",
        apellido2: estudianteEditar.apellido2 ?? "",
        correo: estudianteEditar.correo ?? "",
        telefono: estudianteEditar.telefono ?? "",
        ci: estudianteEditar.ci ?? "",
        carrera: null,
        registro: estudianteEditar.nroRegistro ?? "",
      });
    } else {
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
    }
    setTouched({});
  }, [estudianteEditar, visible]);

  useEffect(() => {
    if (!visible || !estudianteEditar || !carreras?.length) return;

    const idDeDto =
      estudianteEditar.id_carrera ??
      estudianteEditar.carrera_id ??
      (typeof estudianteEditar.carrera === "number"
        ? estudianteEditar.carrera
        : null);

    let carreraId = idDeDto ? Number(idDeDto) : null;

    if (!carreraId) {
      const nombre = (estudianteEditar.carrera ?? "")
        .toString()
        .trim()
        .toLowerCase();
      const match = (carreras || []).find(
        (c) => (c.nombre_carrera || "").toLowerCase() === nombre
      );
      carreraId = match ? Number(match.id_carrera) : null;
    }

    setForm((prev) => ({ ...prev, carrera: carreraId }));
  }, [visible, estudianteEditar, carreras]);

  const errors = {};
  if (touched.nombre && !form.nombre.trim())
    errors.nombre = "El nombre es obligatorio.";
  if (touched.apellido1 && !form.apellido1.trim())
    errors.apellido1 = "El primer apellido es obligatorio.";
  if (touched.correo && !form.correo.trim())
    errors.correo = "El correo es obligatorio.";
  if (
    touched.correo &&
    form.correo &&
    !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())
  )
    errors.correo = "Correo inválido.";
  if (touched.telefono && form.telefono && !/^\d{7,15}$/.test(form.telefono))
    errors.telefono = "Teléfono inválido.";
  if (touched.carrera && !form.carrera)
    errors.carrera = "Seleccione la carrera.";
  if (touched.registro && !form.registro.trim())
    errors.registro = "El número de registro es obligatorio.";

  const handleInput = (name, value) => {
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const requiredFields = [
      "nombre",
      "apellido1",
      "correo",
      "carrera",
      "registro",
    ];
    const touchedAll = Object.fromEntries(requiredFields.map((f) => [f, true]));
    setTouched({ ...touched, ...touchedAll });

    if (
      !form.nombre.trim() ||
      !form.apellido1.trim() ||
      !form.correo.trim() ||
      !form.carrera ||
      !form.registro.trim() ||
      (form.correo &&
        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(form.correo.trim())) ||
      (form.telefono && !/^\d{7,15}$/.test(form.telefono))
    )
      return;

    const estudiante = {
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      correo: form.correo,
      telefono: form.telefono,
      ci: form.ci,
      carrera: form.carrera,
      numeroregistro: form.registro,
    };

    try {
      if (estudianteEditar) {
        await editarEstudiante({
          id: estudianteEditar.id_estudiante,
          estudiante,
        });
        toast.current.show({
          severity: "success",
          summary: "Estudiante actualizado",
          detail: `${form.nombre} ${form.apellido1}`,
        });
      } else {
        await crearEstudiantes({ estudiantes: [estudiante] });
        toast.current.show({
          severity: "success",
          summary: "Estudiante registrado",
          detail: `${form.nombre} ${form.apellido1}`,
        });
      }
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
      setSaving(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "No se pudo guardar el estudiante.",
      });
      setSaving(false);
    }
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
          {estudianteEditar ? "Editar Estudiante" : "Registrar Estudiante"}
        </span>
      </div>
    </div>
  );



  return (
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
      <Toast ref={toast} />
      <div className="relative">
        {saving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mr-3" />
            <span className="text-[#e11d1d] text-lg font-semibold">
              {estudianteEditar ? "Actualizando" : "Guardando"} estudiante...
            </span>
          </div>
        )}
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            await handleSubmit(e);
            setSaving(false);
          }}
        >
          <div>
            <label className="block text-black font-semibold mb-1">
              Nombre <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.nombre}
              onChange={(e) => handleInput("nombre", e.target.value)}
              className={`w-full border-black rounded ${
                errors.nombre ? "p-invalid" : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              autoFocus
              placeholder="Nombre(s)"
              disabled={saving}
            />
            {errors.nombre && (
              <small className="text-[#e11d1d]">{errors.nombre}</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Primer Apellido <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.apellido1}
              onChange={(e) => handleInput("apellido1", e.target.value)}
              className={`w-full border-black rounded ${
                errors.apellido1 ? "p-invalid" : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, apellido1: true }))}
              placeholder="Primer apellido"
              disabled={saving}
            />
            {errors.apellido1 && (
              <small className="text-[#e11d1d]">{errors.apellido1}</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Segundo Apellido
            </label>
            <InputText
              value={form.apellido2}
              onChange={(e) => handleInput("apellido2", e.target.value)}
              className="w-full border-black rounded"
              placeholder="Segundo apellido"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Correo <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.correo}
              onChange={(e) => handleInput("correo", e.target.value)}
              className={`w-full border-black rounded ${
                errors.correo ? "p-invalid" : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
              placeholder="ejemplo@correo.com"
              disabled={saving}
            />
            {errors.correo && (
              <small className="text-[#e11d1d]">{errors.correo}</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Número de Teléfono
            </label>
            <InputText
              value={form.telefono}
              onChange={(e) => handleInput("telefono", e.target.value)}
              className={`w-full border-black rounded ${
                errors.telefono ? "p-invalid" : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
              placeholder="Ej: 78912345"
              maxLength={15}
              disabled={saving}
            />
            {errors.telefono && (
              <small className="text-[#e11d1d]">{errors.telefono}</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">CI</label>
            <InputText
              value={form.ci}
              onChange={(e) => handleInput("ci", e.target.value)}
              className="w-full border-black rounded"
              placeholder="Carnet de identidad"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Carrera <span className="text-[#e11d1d]">*</span>
            </label>
            <Dropdown
              value={form.carrera}
              options={carrerasDropdown}
              onChange={(e) => handleInput("carrera", e.value)}
              className={`w-full border-black rounded ${
                errors.carrera ? "p-invalid" : ""
              }`}
              placeholder="Seleccione una carrera"
              onBlur={() => setTouched((t) => ({ ...t, carrera: true }))}
              filter
              showClear
              disabled={saving}
            />
            {errors.carrera && (
              <small className="text-[#e11d1d]">{errors.carrera}</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Número de Registro <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={form.registro}
              onChange={(e) => handleInput("registro", e.target.value)}
              className={`w-full border-black rounded ${
                errors.registro ? "p-invalid" : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, registro: true }))}
              placeholder="Número de registro universitario"
              disabled={saving}
            />
            {errors.registro && (
              <small className="text-[#e11d1d]">{errors.registro}</small>
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
              label={estudianteEditar ? "Actualizar" : "Registrar"}
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
                (form.correo &&
                  !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(
                    form.correo.trim()
                  )) ||
                (form.telefono && !/^\d{7,15}$/.test(form.telefono))
              }
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
}
