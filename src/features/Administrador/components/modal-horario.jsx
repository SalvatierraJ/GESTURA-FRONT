import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// --- Tus datos y componentes base ---
const timeSlots = [
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];
const visibleSlots = [...timeSlots];
const classBlocks = [
  {
    title: "FÍSICA I",
    subtitle: "(Modular)",
    color: "bg-green-200",
    textColor: "text-green-900",
    col: 0,
    startRow: 0,
    rowSpan: 2,
  },
  {
    title: "MATEMÁTICA DISCRETA",
    subtitle: "(Bimodular)",
    color: "bg-blue-100",
    textColor: "text-blue-900",
    col: 1,
    startRow: 0,
    rowSpan: 2,
  },
  {
    title: "CÁLCULO DE VARIAS VARIABLE",
    subtitle: "(Bimodular)",
    color: "bg-yellow-200",
    textColor: "text-yellow-900",
    col: 2,
    startRow: 0,
    rowSpan: 2,
  },
  {
    title: "PROGRAMACION ORIENTADA A OBJETOS",
    subtitle: "(Modular)",
    color: "bg-red-200",
    textColor: "text-red-800",
    col: 1,
    startRow: 6,
    rowSpan: 2,
  },
  {
    title: "SISTEMAS OPERATIVOS",
    subtitle: "(Modular)",
    color: "bg-teal-200",
    textColor: "text-teal-900",
    col: 0,
    startRow: 11,
    rowSpan: 2,
  },
];

function ScheduleBlock({ title, subtitle, color, textColor, style }) {
  return (
    <div
      className={`absolute rounded-lg shadow ${color} ${textColor} px-4 py-2 text-xs`}
      style={style}
    >
      <span className="block font-semibold text-sm leading-snug">{title}</span>
      <span className="block text-xs font-normal opacity-80">{subtitle}</span>
    </div>
  );
}

function ScheduleGrid() {
  const rowHeight = 60;
  const firstHourTop = 0;
  function getBlockStyle(block) {
    return {
      left: `${block.col * 230 + 65}px`,
      top: `${block.startRow * rowHeight + firstHourTop}px`,
      width: "210px",
      height: `${block.rowSpan * rowHeight - 8}px`,
      zIndex: 10,
    };
  }
  return (
    <div className="relative w-[800px] h-[900px] mx-auto my-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Horas */}
      <div className="absolute left-0 top-0 z-10 h-full w-[55px]">
        {visibleSlots.map((slot) => (
          <div
            key={slot}
            className="h-[60px] flex items-start justify-end pr-2 text-xs text-gray-400 pt-1"
          >
            {slot}
          </div>
        ))}
      </div>
      {/* Líneas horizontales */}
      <div className="absolute left-0 top-0 right-0 bottom-0 z-0">
        {visibleSlots.map((slot, i) => (
          <div
            key={slot}
            className="absolute left-[55px] right-0 border-t border-gray-200"
            style={{
              top: `${i * rowHeight}px`,
            }}
          />
        ))}
      </div>
      {/* Columnas de bloques */}
      <div className="absolute left-[55px] top-0 flex w-[700px] h-full">
        <div className="relative flex-1" style={{ height: "100%" }}></div>
        <div className="relative flex-1" style={{ height: "100%" }}></div>
        <div className="relative flex-1" style={{ height: "100%" }}></div>
      </div>
      {/* Bloques de clases */}
      {classBlocks.map((block, i) => (
        <ScheduleBlock key={i} {...block} style={getBlockStyle(block)} />
      ))}
    </div>
  );
}

// --- APP ---
export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        icon="fas fa-calendar-days"
        severity="danger"
        link
        onClick={() => setVisible(true)}
        className="text-red-600 hover:text-red-800 text-xl bg-red-600"
      />

      <Dialog
        header="Horario de Clases"
        visible={visible}
        style={{ width: "920px", maxWidth: "98vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="flex justify-center bg-white"
      >
        <ScheduleGrid />
      </Dialog>
    </div>
  );
}
