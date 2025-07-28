import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDefensasStore } from "@/store/defensas.store";

export default function ModalNotaDefensa({ id_defensa, notaActual, onSuccess }) {
  const [visible, setVisible] = useState(false);
  const [nota, setNota] = useState(notaActual || 0);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const { actualizarNota } = useDefensasStore();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarNota(id_defensa, nota);
      setVisible(false);
      if (onSuccess) onSuccess();
      toast.current.show({ severity: "success", summary: "Nota guardada" });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "No se pudo guardar la nota",
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
          tooltip="Agregar o editar nota"
        />
      <Dialog
        header="Agregar Nota"
        visible={visible}
        style={{ width: 350 }}
        modal
        onHide={() => setVisible(false)}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
          <label className="font-semibold text-gray-800">
            Nota (0 a 100)
          </label>
          <InputNumber
            value={nota}
            onValueChange={(e) => setNota(e.value)}
            min={0}
            max={100}
            showButtons
            required
            className="w-full"
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
              disabled={nota === null || nota < 0 || nota > 100}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
