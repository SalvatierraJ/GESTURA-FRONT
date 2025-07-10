import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDefensasStore } from "@/store/defensas.store";

export default function ModalAulaDefensa({ id_defensa, aulaActual, onSuccess }) {
  const [visible, setVisible] = useState(false);
  const [aula, setAula] = useState(aulaActual || "");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const { actualizarAula } = useDefensasStore();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarAula(id_defensa, aula);
      setVisible(false);
      if (onSuccess) onSuccess();
      toast.current.show({ severity: "success", summary: "Aula guardada" });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "No se pudo guardar el aula",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text"
        onClick={() => setVisible(true)}
        tooltip="Agregar o editar aula"
      />
      <Dialog
        header="Agregar Aula"
        visible={visible}
        style={{ width: 350 }}
        modal
        onHide={() => setVisible(false)}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
          <label className="font-semibold text-gray-800">Aula</label>
          <InputText
            value={aula}
            onChange={(e) => setAula(e.target.value)}
            required
            placeholder="Ejemplo: Aula 302"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              label="Cancelar"
              type="button"
              className="p-button-text"
              onClick={() => setVisible(false)}
            />
            <Button
              label="Guardar"
              type="submit"
              loading={loading}
              disabled={!aula.trim()}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
