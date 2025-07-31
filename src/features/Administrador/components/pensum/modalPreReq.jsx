import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

export default function ModalEditPrereqEquiv({
  visible,
  onHide,
  modo, // "prereq" o "equiv"
  materiaActual,
  materiasIdNombrePensum,
  initialValues,
  onSave,
}) {
  // Excluir la propia materia
  const materiasOptions = materiasIdNombrePensum
    .filter((m) => m.id !== materiaActual.id)
    .map((m) => ({
      label: m.nombre,
      value: m.id,
    }));

  // Para total de materias como prerequisito especial
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [totalMaterias, setTotalMaterias] = useState(null);

  useEffect(() => {
    if (modo === "prereq" && initialValues) {
      // Separa ids y total de materias
      setSelectedMaterias(
        initialValues.filter((pr) => pr.id).map((pr) => pr.id)
      );
      const totalPr = initialValues.find((pr) => pr.total_materia);
      setTotalMaterias(totalPr ? totalPr.total_materia : null);
    } else if (modo === "equiv" && initialValues) {
      setSelectedMaterias(initialValues.map((eq) => eq.id));
    }
  }, [initialValues, modo, visible]);

  const handleSave = () => {
    if (modo === "prereq") {
      // Array de ids + posible total_materia
      const result = [
        ...selectedMaterias.map((id) => ({ id })),
        ...(totalMaterias && totalMaterias > 0
          ? [{ id: null, total_materia: totalMaterias }]
          : []),
      ];
      onSave(result);
    } else {
      // Array de ids para equivalencias
      onSave(selectedMaterias.map((id) => ({ id })));
    }
    onHide();
  };

  return (
    <Dialog
      header={`Editar ${modo === "prereq" ? "Prerrequisitos" : "Equivalencias"}`}
      visible={visible}
      style={{ width: "30vw" }}
      onHide={onHide}
      footer={
        <div>
          <Button label="Cancelar" onClick={onHide} className="p-button-text" />
          <Button label="Guardar" onClick={handleSave} autoFocus />
        </div>
      }
    >
      <div className="mb-4">
        <MultiSelect
          value={selectedMaterias}
          options={materiasOptions}
          onChange={(e) => setSelectedMaterias(e.value)}
          filter
          display="chip"
          placeholder={`Selecciona ${modo === "prereq" ? "prerrequisitos" : "equivalencias"}`}
          className="w-full"
        />
      </div>
      {modo === "prereq" && (
        <div>
          <label className="block mb-2 font-bold text-sm text-black">Aprobar N materias:</label>
          <InputNumber
            value={totalMaterias}
            onValueChange={(e) => setTotalMaterias(e.value)}
            min={0}
            placeholder="Ej: 4"
            className="w-full"
          />
        </div>
      )}
    </Dialog>
  );
}
