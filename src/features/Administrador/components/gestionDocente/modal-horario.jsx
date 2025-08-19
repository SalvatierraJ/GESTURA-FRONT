import React, { useState, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// Horarios base del día
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

// Colores para las materias
const colors = [
  { bg: "bg-blue-200", text: "text-blue-900" },
  { bg: "bg-green-200", text: "text-green-900" },
  { bg: "bg-yellow-200", text: "text-yellow-900" },
  { bg: "bg-red-200", text: "text-red-800" },
  { bg: "bg-purple-200", text: "text-purple-900" },
  { bg: "bg-teal-200", text: "text-teal-900" },
  { bg: "bg-orange-200", text: "text-orange-900" },
  { bg: "bg-pink-200", text: "text-pink-900" },
];

function parseHorario(horario) {
  // Parsea horarios como "15:00-19:00" o "07:15-10:00"
  const match = horario.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
  if (!match) return null;
  
  const startHour = parseInt(match[1]);
  const startMin = parseInt(match[2]);
  const endHour = parseInt(match[3]);
  const endMin = parseInt(match[4]);
  
  return {
    startHour,
    startMin,
    endHour, 
    endMin,
    duration: (endHour * 60 + endMin) - (startHour * 60 + startMin)
  };
}

function getTimeSlotIndex(hour) {
  return timeSlots.findIndex(slot => parseInt(slot.split(':')[0]) === hour);
}

function ScheduleBlock({ title, subtitle, color, textColor, style, modalidad, turno }) {
  return (
    <div
      className={`absolute rounded-lg shadow ${color} ${textColor} px-3 py-2 text-xs border-l-4 border-gray-400`}
      style={style}
    >
      <div className="font-semibold text-sm leading-tight">{title}</div>
      <div className="text-xs font-normal opacity-80">{subtitle}</div>
      {modalidad && (
        <div className="text-xs mt-1 font-medium">{modalidad}</div>
      )}
      {turno && (
        <div className="text-xs opacity-70">{turno}</div>
      )}
    </div>
  );
}

function ScheduleGrid({ materiasHorarios = [] }) {
  const rowHeight = 60;
  const firstHourTop = 0;
  
  const classBlocks = useMemo(() => {
    const blocks = [];
    const materiasMap = new Map();
    
    materiasHorarios.forEach((materiaHorario, index) => {
      const parsed = parseHorario(materiaHorario.horario);
      if (!parsed) return;
      
      const startSlotIndex = getTimeSlotIndex(parsed.startHour);
      if (startSlotIndex === -1) return;
      
      // Calcular duración en slots (cada slot = 1 hora = 60 minutos)
      const durationInSlots = Math.ceil(parsed.duration / 60);
      
      // Asignar columna basada en el horario para evitar solapamientos
      let col = 0;
      const key = `${parsed.startHour}-${parsed.endHour}`;
      if (materiasMap.has(key)) {
        col = materiasMap.get(key) + 1;
      }
      materiasMap.set(key, col);
      
      // Limitar a 3 columnas máximo
      col = col % 3;
      
      const colorIndex = index % colors.length;
      
      blocks.push({
        title: materiaHorario.materia_nombre,
        subtitle: `${materiaHorario.materia_siglas} - Grupo ${materiaHorario.grupo}`,
        color: colors[colorIndex].bg,
        textColor: colors[colorIndex].text,
        modalidad: materiaHorario.modalidad,
        turno: materiaHorario.turno,
        col,
        startRow: startSlotIndex,
        rowSpan: Math.max(1, durationInSlots),
        horario: materiaHorario.horario,
        gestion: materiaHorario.gestion
      });
    });
    
    return blocks;
  }, [materiasHorarios]);

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
        {timeSlots.map((slot) => (
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
        {timeSlots.map((slot, i) => (
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
export default function ModalHorario({ materiasHorarios = [], docenteNombre = "Docente" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        icon="fas fa-calendar-days"
        severity="danger"
        link
        onClick={() => setVisible(true)}
        className="text-red-600 hover:text-red-800 text-xl bg-red-600"
        tooltip="Ver horario del docente"
        tooltipOptions={{ position: "top" }}
      />

      <Dialog
        header={`Horario de ${docenteNombre}`}
        visible={visible}
        style={{ width: "920px", maxWidth: "98vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="flex justify-center bg-white"
      >
        <div className="w-full">
          {materiasHorarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay materias asignadas para este docente.
            </div>
          ) : (
            <ScheduleGrid materiasHorarios={materiasHorarios} />
          )}
        </div>
      </Dialog>
    </div>
  );
}
