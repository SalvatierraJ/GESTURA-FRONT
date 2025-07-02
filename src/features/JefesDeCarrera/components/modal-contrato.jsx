import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// Tus datos originales
const columns = [
  { label: "Fecha Mod. Fin" }, { label: "Fecha Mod. Fin" }, { label: "Fecha Mod. Fin" },
  { label: "Fecha Mod. Fin" }, { label: "Fecha Mod. Fin" }, { label: "Fecha Mod. Fin" },
  { label: "Fecha Mod. Fin" },
];

const rows = [
  { code: "M0", label: "FECHA MOD INICIO", values: ["30", "", "", "", "", "", ""], colors: ["green", "", "", "", "red", "red", "red"] },
  { code: "M1", label: "FECHA MOD INICIO", values: ["", "25", "", "", "red", "red", "red"], colors: ["", "green", "", "", "red", "red", "red"] },
  { code: "M2", label: "FECHA MOD INICIO", values: ["", "", "28", "", "", "red", "red"], colors: ["", "", "green", "", "", "red", "red"] },
  { code: "M3", label: "FECHA MOD INICIO", values: ["", "", "", "22", "", "red", "red"], colors: ["", "", "", "green", "", "red", "red"] },
  { code: "M4", label: "FECHA MOD INICIO", values: ["", "", "", "", "30", "", ""], colors: ["", "", "", "", "green", "", ""] },
  { code: "M5", label: "FECHA MOD INICIO", values: ["", "", "", "", "", "", "27"], colors: ["", "", "", "", "", "", "green"] },
];

// Ajuste para la celda amarilla
rows[0].values[3] = "";
rows[0].colors[3] = "yellow";

function getCellStyle(color) {
  if (color === "green") {
    return "bg-green-400 text-white font-bold";
  }
  if (color === "yellow") {
    return "bg-yellow-300 text-yellow-900 font-bold";
  }
  if (color === "red") {
    return "bg-red-500 text-white font-bold";
  }
  return "bg-green-100";
}

function LegendItem({ color, label }) {
  const colorClass =
    color === "green"
      ? "bg-green-400"
      : color === "yellow"
      ? "bg-yellow-300"
      : "bg-red-500";
  return (
    <div className="flex items-center mr-6">
      <span className={`inline-block w-6 h-4 rounded mr-2 ${colorClass}`}></span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

export default function Contratos() {
  const [visible, setVisible] = useState(false);

  return (
    <div >
      <Button
        icon="pi pi-table"
        onClick={() => setVisible(true)}
        className="p-0 text-red-600 hover:text-red-800 text-2xl bg-transparent border-none shadow-none"
        style={{ background: "none", boxShadow: "none", border: "none" }}
      />
      <Dialog
        header="Módulos"
        visible={visible}
        style={{ width: "950px", maxWidth: "98vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white"
      >
        <div className="w-full max-w-5xl mx-auto">
          <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-24"></th>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="text-center py-1 px-2 text-sm font-medium text-gray-600"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ridx) => (
                  <tr key={ridx}>
                    <td className="py-2 pr-2 text-left align-middle w-24">
                      <span className="block font-bold text-gray-700">{row.code}</span>
                      <span className="block text-xs text-gray-400 -mt-0.5">{row.label}</span>
                    </td>
                    {row.values.map((val, cidx) => (
                      <td key={cidx} className="text-center py-1 px-1 align-middle">
                        <div
                          className={
                            "h-12 w-16 flex items-center justify-center rounded-lg mx-auto " +
                            (row.colors[cidx]
                              ? getCellStyle(row.colors[cidx])
                              : "bg-green-100")
                          }
                        >
                          <span className="text-lg">{val}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Leyenda */}
          <div className="flex flex-wrap items-center mt-6 mb-2">
            <LegendItem color="green" label="Apto para recontratación (Días hábiles)" />
            <LegendItem color="yellow" label="Posibilidad de contratación mínima" />
            <LegendItem color="red" label="Sin posibilidad de recontratación" />
          </div>
          {/* Botones */}
          <div className="flex justify-end items-center w-full mt-2 mb-2">
            <button
              className="mr-3 text-gray-600 hover:underline text-base font-medium"
              onClick={() => setVisible(false)}
              type="button"
            >
              Cancelar
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 text-base shadow">
              <i className="fas fa-file-contract"></i>
              Solicitar Contrato
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
