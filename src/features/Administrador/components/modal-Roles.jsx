import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useRolStore } from "@/store/roles.store";
import { Toast } from "primereact/toast";

export default function ModalRolCascada({
  onSave,
  initialData = null,
  visible,
  onClose,
  onSuccess,
}) {
  const [roleName, setRoleName] = useState("");
  const [controlTotal, setControlTotal] = useState(false);
  const [modPermisos, setModPermisos] = useState({});
  const [openModules, setOpenModules] = useState({});
  const [saving, setSaving] = useState(false);
  const toast = useRef(null);
  const isEstudiante = roleName.trim().toLowerCase() === "estudiante";
  const isEdit = !!initialData;
  const { modulos, permisos, cargarModulos, cargarPermisos } = useRolStore();

  useEffect(() => {
    cargarModulos();
    cargarPermisos();
  }, [cargarModulos, cargarPermisos]);

  useEffect(() => {
    if (modulos.length > 0) {
      const estadoInicial = {};
      modulos.forEach((mod) => (estadoInicial[mod.key] = false));
      setOpenModules(estadoInicial);
    }
  }, [modulos]);

  useEffect(() => {
    if (visible) {
      setRoleName(initialData?.nombre || "");
      if (initialData?.modulos?.length > 0) {
        const agrupado = {};
        initialData.modulos.forEach((item) => {
          const modId = parseInt(item.id);
          const permisoId = parseInt(item.permiso?.id);
          if (!agrupado[modId]) agrupado[modId] = [];
          if (!agrupado[modId].includes(permisoId)) {
            agrupado[modId].push(permisoId);
          }
        });
        setModPermisos(agrupado);
      } else {
        setModPermisos({});
      }
      setControlTotal(initialData?.esTotal || false);
    }
  }, [visible, initialData]);

  const toggleModule = (key) => {
    setOpenModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleControlTotal = (checked) => {
    setControlTotal(checked);
    if (checked) {
      const todos = {};
      modulos.forEach((mod) => {
        const perms = permisos
          .filter((p) => p.modulo === mod.key)
          .map((p) => p.key);
        todos[mod.key] = perms;
      });
      setModPermisos(todos);
    } else {
      setModPermisos({});
    }
  };

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

  const header = (
    <div
      className="flex items-center justify-between rounded-t-2xl"
      style={{
        width: "100%",
        background: "#e11d1d",
        color: "#fff",
        padding: "1.1rem 2rem",
        borderBottom: "4px solid #fff",
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-user-plus text-2xl text-white" />
        <span className="text-2xl font-bold tracking-wide text-white">
          {initialData ? "Editar Rol" : "Agregar Rol"}
        </span>
      </div>
    </div>
  );

  const valido =
    roleName.trim().length > 0 && Object.values(modPermisos).flat().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valido) {
      toast.current?.show({
        severity: "warn",
        summary: "Formulario incompleto",
        detail: "Debes completar todos los campos obligatorios.",
        life: 3000,
      });
      return;
    }

    const modulosPermisos = Object.entries(modPermisos).map(
      ([modKey, perms]) => ({
        idModulo: parseInt(modKey),
        permisos: perms,
      })
    );

    const payload = {
      nombre: roleName,
      modulosPermisos,
      esTotal: controlTotal,
      ...(initialData?.id && { id: initialData.id }),
    };

    setSaving(true);
    try {
      if (onSave) await onSave(payload);
      if (onSuccess) onSuccess();

      toast.current?.show({
        severity: "success",
        summary: "Rol guardado",
        detail: "El rol fue guardado correctamente.",
        life: 3000,
      });

      onClose?.();
      setRoleName("");
      setModPermisos({});
      setSelectedCarreras([]);
      setControlTotal(false);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Ocurrió un error al guardar el rol.",
        life: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={header}
        visible={visible}
        style={{ width: "950px" }}
        modal
        onHide={onClose}
        className="rounded-2xl"
      >
        <div className="relative">
          {saving && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
              <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mb-2" />
              <span className="text-[#e11d1d] text-lg font-semibold">
                Guardando rol...
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-semibold">Nombre de Rol</label>
                <InputText
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full"
                  disabled={saving}
                />
              </div>

              <div className="border rounded p-4 bg-gray-50">
                {modulos.map((mod) => (
                  <div key={mod.Id_Modulo} className="mb-3">
                    <div
                      onClick={() => !saving && toggleModule(mod.Id_Modulo)}
                      className="flex items-center cursor-pointer text-lg text-red-600 font-semibold mb-2"
                    >
                      {openModules[mod.Id_Modulo] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}{" "}
                      {mod.Nombre}
                    </div>
                    {mod.Nombre?.toLowerCase() === "mis defensas" && (
                      <div className="mb-2 pl-8 pr-2">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 text-sm p-2 rounded">
                          Este módulo está hecho solo para que los estudiantes
                          puedan ver sus defensas.
                          <br />
                          <span className="font-semibold">
                            No está pensado ni habilitado para administradores.
                          </span>
                        </div>
                      </div>
                    )}
                    {openModules[mod.Id_Modulo] && (
                      <div className="grid grid-cols-4 gap-3 pl-6">
                        {permisos
                          .filter((p) => p.modulo === mod.Id_Permiso)
                          .map((permiso) => (
                            <div
                              key={permiso.Id_Permiso}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={(() => {
                                  const modId = parseInt(mod.Id_Modulo);
                                  const permisoId = parseInt(permiso.Id_Permiso);
                                  const result =
                                    modPermisos[modId]?.includes(permisoId);
                                  return result || false;
                                })()}
                                onChange={(e) =>
                                  handlePermisoChange(
                                    parseInt(mod.Id_Modulo),
                                    parseInt(permiso.Id_Permiso),
                                    e.checked
                                  )
                                }
                                disabled={saving}
                              />
                              <div className="flex flex-col text-sm">
                                <span className="font-medium">
                                  {permiso.Nombre}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {permiso.Descripcion}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  label="Cancelar"
                  className="p-button-text font-semibold border-none"
                  style={{ color: "#e11d1d" }}
                  onClick={onClose}
                  disabled={saving}
                />
                <Button
                  type="submit"
                  label={saving ? "Guardando..." : "Guardar"}
                  className="font-semibold border-none"
                  style={{
                    background: "#e11d1d",
                    color: "#fff",
                    minWidth: 120,
                    fontWeight: 600,
                    opacity: valido ? 1 : 0.6,
                  }}
                  disabled={!valido || saving}
                  loading={saving}
                />
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
