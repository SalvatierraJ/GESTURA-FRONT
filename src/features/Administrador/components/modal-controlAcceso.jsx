import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useRolStore } from "@/store/roles.store";
import { useUserStore } from "@/store/users.store";
import { useCasosStore } from "@/store/casos.store";
import { useAuthStore } from "@/store/authStore";

const ModalUsuario = forwardRef(({ onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { roles, cargarRoles } = useRolStore();
  const registerUser = useUserStore((state) => state.registerUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const { carreras, cargarCarreras } = useCasosStore();

  const [personQuery, setPersonQuery] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(null);
  const { results, searchPeople, clear } = useAuthStore();

  const handleSelectPerson = (p) => {
    setSelectedPersona(p);
    setPersonQuery(`${p.Nombre} ${p.Apellido1} ${p.Apellido2} (${p.CI})`);
    clear();
  };
  useEffect(() => {
    if (!visible || isEdit) return;
    if (!personQuery) {
      clear();
      return;
    }
    const handler = setTimeout(() => {
      searchPeople(personQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [personQuery, visible, isEdit]);
  useEffect(() => {
    cargarRoles(1, 100);
    cargarCarreras(1, 100);
  }, [cargarRoles, cargarCarreras]);

  useImperativeHandle(ref, () => ({
    openForCreate: () => {
      setIsEdit(false);
      setEditingUserId(null);
      setForm({ correo: "", password: "", roles: [], carreras: [] });
      setTouched({});
      setVisible(true);
    },
    openForEdit: (usuario) => {
      setIsEdit(true);
      setEditingUserId(usuario.id);
      setForm({
        correo: usuario.username ? usuario.username : "sin usaurio",
        password: "",
        roles: usuario.roles?.map((rol) => rol.id) || [],
        carreras: usuario.carreras?.map((c) => c.id) || [],
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
    carreras: [],
  });
  const [touched, setTouched] = useState({});
  const isEstudiante = form.roles.some(
    (rolId) =>
      roles.find((r) => r.id === rolId)?.nombre.toLowerCase() === "estudiante"
  );

  const handleInput = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ correo: true, password: true, roles: true });

    if ((!isEdit && !form.correo.trim()) || form.roles.length === 0) return;

    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await updateUser(editingUserId, {
          Nombre_Usuario: form.correo.trim() || undefined,
          Password: form.password.trim() || undefined,
          Id_Rol: form.roles,
          carreras: isEstudiante ? [] : form.carreras,
        });
      } else {
        await registerUser({
          Nombre_Usuario: form.correo,
          Password: form.password,
          Id_Rol: form.roles,
          carreras: isEstudiante ? [] : form.carreras,
          id_persona: selectedPersona?.Id_Persona || undefined,
        });
      }
      setVisible(false);
      setForm({ correo: "", password: "", roles: [], carreras: [] });
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
        <i
          className={`pi pi-user-${
            isEdit ? "edit" : "plus"
          } text-2xl text-white`}
        />
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
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
            <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mb-2" />
            <span className="text-[#e11d1d] text-lg font-semibold">
              {isEdit ? "Actualizando usuario..." : "Registrando usuario..."}
            </span>
          </div>
        )}
        <form
          className="px-7 pt-6 pb-3 flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          {!isEdit && (
            <div>
              <label className="block text-black font-semibold mb-1">
                Buscar persona existente
              </label>
              <InputText
                value={personQuery}
                onChange={(e) => {
                  setPersonQuery(e.target.value);
                  setSelectedPersona(null); // Borra selección al escribir
                }}
                className="w-full border-black rounded"
                placeholder="Buscar por nombre, CI, correo, etc."
                disabled={loading}
                autoComplete="off"
              />
              {personQuery && !selectedPersona && results.length > 0 && (
                <ul className="bg-white shadow rounded mt-1 max-h-40 overflow-auto border z-20 absolute w-full">
                  {results.map((p) => (
                    <li
                      key={p.Id_Persona}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPerson(p)}
                    >
                      {p.Nombre} {p.Apellido1} {p.Apellido2} — {p.CI}
                    </li>
                  ))}
                </ul>
              )}
              {loading && (
                <div className="text-xs text-gray-500 mt-1">Buscando...</div>
              )}
              {personQuery && !loading && results.length === 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  No se encontraron coincidencias.
                </div>
              )}
              {selectedPersona && (
                <div className="mt-1 text-xs text-green-700">
                  Seleccionado: {selectedPersona.Nombre}{" "}
                  {selectedPersona.Apellido1} {selectedPersona.Apellido2} (
                  {selectedPersona.CI})
                </div>
              )}
            </div>
          )}
          <div>
            <label className="block text-black font-semibold mb-1">
              Usuario {isEdit ? "" : <span className="text-[#e11d1d]">*</span>}
            </label>
            <InputText
              value={form.correo}
              onChange={(e) => handleInput("correo", e.target.value)}
              className={`w-full border-black rounded ${
                touched.correo && !form.correo.trim() && !isEdit
                  ? "p-invalid"
                  : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
              placeholder={
                isEdit
                  ? "Dejar en blanco para mantener el correo"
                  : "Nombre Usuario o Email"
              }
              autoComplete="off"
              disabled={loading}
            />
            {isEdit && (
              <small className="text-gray-600">
                Dejar en blanco para mantener el correo actual.
              </small>
            )}
            {touched.correo && !form.correo.trim() && !isEdit && (
              <small className="text-[#e11d1d]">
                El correo es obligatorio.
              </small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">
              Contraseña{" "}
              {isEdit ? "" : <span className="text-[#e11d1d]">*</span>}
            </label>
            <InputText
              value={form.password}
              onChange={(e) => handleInput("password", e.target.value)}
              className={`w-full border-black rounded ${
                touched.password && !form.password.trim() && !isEdit
                  ? "p-invalid"
                  : ""
              }`}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder={
                isEdit
                  ? "Dejar en blanco para mantener la contraseña"
                  : "Contraseña"
              }
              type="password"
              autoComplete="new-password"
              disabled={loading}
            />
            {isEdit && (
              <small className="text-gray-600">
                Dejar en blanco para mantener la contraseña actual.
              </small>
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
              disabled={loading}
            />
            {touched.roles && form.roles.length === 0 && (
              <small className="text-[#e11d1d]">
                Selecciona al menos un rol.
              </small>
            )}
          </div>
          {error && (
            <div className="text-[#e11d1d] text-center font-medium mt-1">
              {error}
            </div>
          )}

          {!isEstudiante && (
            <div>
              <label className="block text-black font-semibold mb-1">
                Carreras Administradas
              </label>
              <MultiSelect
                value={form.carreras}
                options={carreras.map((c) => ({
                  label: c.nombre_carrera,
                  value: c.id_carrera,
                }))}
                onChange={(e) => setForm((f) => ({ ...f, carreras: e.value }))}
                optionLabel="label"
                placeholder="Selecciona una o más carreras"
                className="w-full border-black rounded"
                display="chip"
                disabled={loading}
              />
              {touched.carreras && form.carreras.length === 0 && (
                <small className="text-[#e11d1d]">
                  Selecciona al menos una carrera.
                </small>
              )}
            </div>
          )}
          {isEstudiante && (
            <div>
              <label className="block text-black font-semibold mb-1">
                Carreras Administradas
              </label>
              <InputText
                value="El rol de estudiante no administra carreras."
                disabled
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 pb-2">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text font-semibold"
              style={{ color: "#e11d1d", border: "none" }}
              onClick={() => setVisible(false)}
              disabled={loading}
            />
            <Button
              type="submit"
              label={
                loading
                  ? isEdit
                    ? "Actualizando..."
                    : "Registrando..."
                  : isEdit
                  ? "Actualizar"
                  : "Registrar"
              }
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
              loading={loading}
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
});

export default ModalUsuario;
