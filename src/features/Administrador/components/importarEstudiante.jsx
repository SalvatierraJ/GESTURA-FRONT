import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import * as XLSX from "xlsx";

export default function ImportarEstudiantesExcel({ onImport }) {
  const [visible, setVisible] = React.useState(false);
  const toast = useRef();

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (json.length === 0) {
        toast.current.show({ severity: "error", summary: "Archivo vacío", detail: "No se encontraron datos en el Excel" });
        return;
      }
      // Llama al callback con los datos importados
      onImport && onImport(json);
      toast.current.show({ severity: "success", summary: "Importación exitosa", detail: `Se importaron ${json.length} estudiantes` });
      setVisible(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-upload"
        label="Importar Excel"
        className="bg-white border border-red-600 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50"
        onClick={() => setVisible(true)}
         style={{ backgroundColor: "#e11d1d", hover: "#b91c1c", margin:"10px" }}
      />
      <Dialog
        header="Importar estudiantes desde Excel"
        visible={visible}
        style={{ width: "400px", maxWidth: "95vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <div className="flex flex-col gap-5 p-6">
          <p className="text-sm text-gray-700">
            Sube un archivo Excel (<span className="font-semibold">.xlsx, .xls, .csv</span>) con las columnas:
            <br />
            <span className="font-mono">nombre, apellido1, apellido2, correo, telefono, ci, carrera, registro</span>
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
            onClick={() => setVisible(false)}
          />
        </div>
      </Dialog>
    </>
  );
}
