import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// Opciones de módulos y permisos
const MODULOS = [
  {
    nombre: "Casos de Estudio",
    key: "casos",
    permisos: [
      { label: "Lectura", value: "lectura" },
      { label: "Escritura", value: "escritura" },
      { label: "Edición parcial", value: "edicion_parcial" },
      { label: "Edición total", value: "edicion_total" },
      { label: "Eliminar", value: "eliminar" },
    ],
  },
  {
    nombre: "Gestión de Docentes",
    key: "docentes",
    permisos: [
      { label: "Lectura", value: "lectura" },
      { label: "Escritura", value: "escritura" },
      { label: "Edición", value: "edicion" },
      { label: "Eliminar", value: "eliminar" },
    ],
  },
  
];

export default function ModalRolCascada({ onSave }) {
  const [visible, setVisible] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [controlTotal, setControlTotal] = useState(false);
  const [modPermisos, setModPermisos] = useState({});
  const [openModules, setOpenModules] = useState(() =>
    MODULOS.reduce((acc, mod) => ({ ...acc, [mod.key]: false }), {})
  );

  // Abrir/cerrar módulos
  const toggleModule = (key) => {
    setOpenModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Marcar todos los permisos
  const handleControlTotal = (checked) => {
    setControlTotal(checked);
    if (checked) {
      const todos = {};
      MODULOS.forEach((mod) => {
        todos[mod.key] = mod.permisos.map((p) => p.value);
      });
      setModPermisos(todos);
    } else {
      setModPermisos({});
    }
  };

  // Tildea por módulo y permiso
  const handlePermisoChange = (modKey, permiso, checked) => {
    setControlTotal(false);
    setModPermisos((prev) => {
      const actual = prev[modKey] || [];
      if (checked) {
        return { ...prev, [modKey]: [...actual, permiso] };
      }
      return { ...prev, [modKey]: actual.filter((p) => p !== permiso) };
    });
  };

  // Valida formulario
  const valido =
    roleName.trim().length > 0 && Object.values(modPermisos).flat().length > 0;

  // Guardar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valido) return;
    if (onSave) onSave({ roleName, permisos: modPermisos });
    setVisible(false);
    setRoleName("");
    setModPermisos({});
    setControlTotal(false);
  };

  // HEADER: Ahora compacto, sin separación innecesaria
  const header = (
    <div
      className="flex items-center justify-between rounded-t-2xl"
      style={{
        width: "110%",
        background: "#e11d1d",
        color: "#fff",
        padding: "1.1rem 2rem 1.1rem 1.5rem",
        borderBottom: "4px solid #fff",
        marginLeft: "-24px",
        marginTop: "-34px",
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-user-plus text-2xl text-white" />
        <span
          className="text-2xl font-extrabold tracking-wide text-white"
          style={{ fontFamily: "inherit" }}
        >
          Agregar Rol
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        label="Agregar Rol"
        onClick={() => setVisible(true)}
        className="mb-4 px-6 py-3 font-bold rounded-full text-lg border-none"
        style={{ background: "#e11d1d", color: "#fff" }}
      />

      <Dialog
        header={header}
        visible={visible}
        style={{ width: "900px", maxWidth: "99vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white rounded-b-2xl"
        className="rounded-2xl"
      >
        <form onSubmit={handleSubmit} className="pt-2 pb-8 px-10">
          {/* FORM PRINCIPAL */}
          <div className="flex flex-row justify-between items-end mb-5">
            {/* Nombre de rol */}
            <div className="flex flex-col flex-1">
              <label className="block font-semibold mb-2 text-black">
                Nombre de Rol
              </label>
              <InputText
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-80 border-2 border-black"
                style={{
                  height: "40px",
                  fontSize: "17px",
                  background: "#fafafa",
                }}
                placeholder=""
              />
            </div>
            {/* Control total */}
            <div className="flex items-center gap-2 mb-2 ml-6">
              <Checkbox
                inputId="controlTotal"
                checked={controlTotal}
                onChange={(e) => handleControlTotal(e.checked)}
                className="mr-2"
              />
              <label
                htmlFor="controlTotal"
                className="font-semibold text-lg text-black"
                style={{ fontFamily: "inherit" }}
              >
                Control Total
              </label>
            </div>
          </div>

          {/* CASCADA DE MÓDULOS */}
          <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
            {MODULOS.map((mod) => (
              <div
                key={mod.key}
                className="border-b border-black last:border-b-0"
              >
                {/* Header colapsable */}
                <div
                  className="flex items-center px-6 py-4 font-semibold border-b border-black bg-[#f6f6f6] cursor-pointer select-none transition-all"
                  style={{
                    color: "#e11d1d",
                    fontSize: "20px",
                    borderRadius: "10px 10px 0 0",
                  }}
                  onClick={() => toggleModule(mod.key)}
                >
                  {openModules[mod.key] ? (
                    <FaChevronDown className="mr-3 text-[#e11d1d]" />
                  ) : (
                    <FaChevronRight className="mr-3 text-[#e11d1d]" />
                  )}
                  {mod.nombre}
                </div>
                {/* Permisos */}
                {openModules[mod.key] && (
                  <div className="px-8 py-4 grid grid-cols-5 gap-y-4 bg-white">
                    {mod.permisos.map((permiso) => (
                      <label
                        key={permiso.value}
                        className="flex items-center gap-2 text-black text-base"
                      >
                        <Checkbox
                          inputId={permiso.value + mod.key}
                          checked={
                            modPermisos[mod.key]?.includes(permiso.value) ||
                            false
                          }
                          onChange={(e) =>
                            handlePermisoChange(
                              mod.key,
                              permiso.value,
                              e.checked
                            )
                          }
                          className="mr-2"
                        />
                        {permiso.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <Button
              type="button"
              label="Cancelar"
              className="p-button-text font-semibold border-none"
              style={{ color: "#e11d1d" }}
              onClick={() => setVisible(false)}
            />
            <Button
              type="submit"
              label="Guardar"
              className="font-semibold border-none"
              style={{
                background: "#e11d1d",
                color: "#fff",
                minWidth: 120,
                fontWeight: 600,
                opacity: valido ? 1 : 0.6,
              }}
              disabled={!valido}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
