import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useRolStore } from "@/store/roles.store";
import { useUserStore } from "@/store/users.store";

const ModalUsuario = forwardRef(({ onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { roles, cargarRoles } = useRolStore();
  const registerUser = useUserStore((state) => state.registerUser);
  const updateUser = useUserStore((state) => state.updateUser);

  // Expone método para abrir modal desde cualquier parte
  useImperativeHandle(ref, () => ({
    openForCreate: () => {
      setIsEdit(false);
      setEditingUserId(null);
      setForm({ correo: "", password: "", roles: [] });
      setTouched({});
      setVisible(true);
    },
    openForEdit: (usuario) => {
      setIsEdit(true);
      setEditingUserId(usuario.id); // Cambia según el ID de tu backend
      setForm({
        correo: "", // No mostrar el correo actual (sólo editable)
        password: "",
        roles: usuario.roles?.map((rol) => rol.id) || [],
      });
      setTouched({});
      setVisible(true);
    },
  }));

  useEffect(() => {
    cargarRoles(1, 100);
  }, [cargarRoles]);

  const [form, setForm] = useState({
    correo: "",
    password: "",
    roles: [],
  });
  const [touched, setTouched] = useState({});

  const handleInput = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ correo: true, password: true, roles: true });

    // Reglas de validación
    if (
      (!isEdit && !form.correo.trim()) || // correo requerido solo al registrar
      form.roles.length === 0
    )
      return;

    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await updateUser(editingUserId, {
          Nombre_Usuario: form.correo.trim() || undefined,
          Password: form.password.trim() || undefined,
          Id_Rol: form.roles,
        });
      } else {
        await registerUser({
          Nombre_Usuario: form.correo,
          Password: form.password,
          Id_Rol: form.roles,
        });
      }
      setVisible(false);
      setForm({ correo: "", password: "", roles: [] });
      setTouched({});
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.message || "Error al registrar/editar usuario");
    } finally {
      setLoading(false);
    }
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
        <i className={`pi pi-user-${isEdit ? "edit" : "plus"} text-2xl text-white`} />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          {isEdit ? "Editar Usuario" : "Registrar Usuario"}
        </span>
      </div>
    </div>
  );

  return (
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
            Correo {isEdit ? "" : <span className="text-[#e11d1d]">*</span>}
          </label>
          <InputText
            value={form.correo}
            onChange={(e) => handleInput("correo", e.target.value)}
            className={`w-full border-black rounded ${
              touched.correo && !form.correo.trim() && !isEdit ? "p-invalid" : ""
            }`}
            onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
            placeholder={isEdit ? "Dejar en blanco para mantener el correo" : "ejemplo@correo.com"}
            autoComplete="off"
          />
          {isEdit && (
            <small className="text-gray-600">Dejar en blanco para mantener el correo actual.</small>
          )}
          {touched.correo && !form.correo.trim() && !isEdit && (
            <small className="text-[#e11d1d]">
              El correo es obligatorio.
            </small>
          )}
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">
            Contraseña {isEdit ? "" : <span className="text-[#e11d1d]">*</span>}
          </label>
          <InputText
            value={form.password}
            onChange={(e) => handleInput("password", e.target.value)}
            className={`w-full border-black rounded ${
              touched.password && !form.password.trim() && !isEdit ? "p-invalid" : ""
            }`}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder={isEdit ? "Dejar en blanco para mantener la contraseña" : "Contraseña"}
            type="password"
            autoComplete="new-password"
          />
          {isEdit && (
            <small className="text-gray-600">Dejar en blanco para mantener la contraseña actual.</small>
          )}
          {touched.password && !form.password.trim() && !isEdit && (
            <small className="text-[#e11d1d]">
              La contraseña es obligatoria.
            </small>
          )}
        </div>
        <div>
          <label className="block text-black font-semibold mb-1">
            Roles <span className="text-[#e11d1d]">*</span>
          </label>
          <MultiSelect
            value={form.roles}
            options={roles.map((rol) => ({
              label: rol.nombre,
              value: rol.id,
            }))}
            onChange={(e) => handleInput("roles", e.value)}
            optionLabel="label"
            placeholder="Selecciona uno o más roles"
            className={`w-full border-black rounded ${
              touched.roles && form.roles.length === 0 ? "p-invalid" : ""
            }`}
            display="chip"
            panelClassName="border-black"
          />
          {touched.roles && form.roles.length === 0 && (
            <small className="text-[#e11d1d]">
              Selecciona al menos un rol.
            </small>
          )}
        </div>

        {error && (
          <div className="text-[#e11d1d] text-center font-medium mt-1">{error}</div>
        )}

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
            label={loading ? (isEdit ? "Actualizando..." : "Registrando...") : (isEdit ? "Actualizar" : "Registrar")}
            icon="pi pi-check"
            className="font-semibold border-none"
            style={{
              background: "#e11d1d",
              color: "#fff",
              boxShadow: "0 2px 12px -2px #e11d1d44",
            }}
            disabled={
              loading ||
              (!isEdit && (!form.correo.trim() || !form.password.trim())) ||
              form.roles.length === 0
            }
          />
        </div>
      </form>
    </Dialog>
  );
});

export default ModalUsuario;
