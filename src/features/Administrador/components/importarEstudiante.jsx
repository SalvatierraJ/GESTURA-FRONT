import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import * as XLSX from "xlsx";
import { useEstudiantesStore } from "@/store/estudiantes.store";

export default function ImportarEstudiantesExcel() {
  const [visible, setVisible] = useState(false);
  const [fallidos, setFallidos] = useState([]); 
  const [exitosos, setExitosos] = useState([]); 
  const toast = useRef();

  const crearEstudiantesMasivo = useEstudiantesStore(
    (s) => s.crearEstudiantesMasivo
  );

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (json.length === 0) {
        toast.current.show({
          severity: "error",
          summary: "Archivo vacío",
          detail: "No se encontraron datos en el Excel",
        });
        return;
      }
      try {
        const resultado = await crearEstudiantesMasivo({ estudiantes: json });
        setFallidos(resultado.fallidos || []);
        setExitosos(resultado.exitosos || []);
        if ((resultado.fallidos || []).length === 0) {
          toast.current.show({
            severity: "success",
            summary: "Importación completa",
            detail: `Se importaron ${resultado.exitosos.length} estudiantes correctamente.`,
          });
          setVisible(false);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Importación parcial",
            detail: `Algunos estudiantes no se guardaron. Revísalos abajo.`,
            life: 8000,
          });
        }
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error en importación",
          detail: err.message || "No se pudieron guardar los estudiantes",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const openModal = () => {
    setVisible(true);
    setFallidos([]);
    setExitosos([]);
  };
  const closeModal = () => {
    setVisible(false);
    setFallidos([]);
    setExitosos([]);
  };

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-upload"
        label="Importar Excel"
        className="bg-white border border-red-600 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50"
        onClick={openModal}
        style={{ backgroundColor: "#e11d1d", hover: "#b91c1c", margin: "10px" }}
      />
      <Dialog
        header="Importar estudiantes desde Excel"
        visible={visible}
        style={{ width: "520px", maxWidth: "98vw" }}
        modal
        draggable={false}
        onHide={closeModal}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <div className="flex flex-col gap-5 p-6">
          <p className="text-sm text-gray-700">
            Sube un archivo Excel (
            <span className="font-semibold">.xlsx, .xls, .csv</span>) con las
            columnas:
            <br />
            <span className="font-mono">
              nombre, apellido1, apellido2, correo, telefono, ci, carrera,
              numeroregistro
            </span>
          </p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            className="border border-gray-300 rounded p-2"
          />
          <Button
            label="Cancelar"
            className="p-button-text font-semibold"
            style={{ color: "#e11d1d", border: "none" }}
            onClick={closeModal}
          />

          {fallidos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-[#e11d1d] mb-2">
                Estudiantes no guardados
              </h3>
              <div className="max-h-60 overflow-auto border border-red-200 rounded-lg bg-red-50 p-2">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-[#e11d1d]">
                      <th className="text-left px-2 py-1">Nombre</th>
                      <th className="text-left px-2 py-1">CI</th>
                      <th className="text-left px-2 py-1">Carrera</th>
                      <th className="text-left px-2 py-1">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fallidos.map((f, idx) => (
                      <tr key={idx} className="border-b border-red-100">
                        <td className="px-2 py-1">{f.estudiante?.nombre}</td>
                        <td className="px-2 py-1">{f.estudiante?.ci}</td>
                        <td className="px-2 py-1">{f.estudiante?.carrera}</td>
                        <td className="px-2 py-1 text-[#b91c1c]">{f.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {exitosos.length > 0 && fallidos.length > 0 && (
            <div className="mt-4 text-green-700">
              <b>{exitosos.length}</b> estudiantes se guardaron correctamente.
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
