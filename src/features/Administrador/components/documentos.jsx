import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const AREAS = [
  { name: "Inteligencia Artificial", code: "IA" },
  { name: "Redes", code: "NET" },
  { name: "Desarrollo Web", code: "WEB" },
  { name: "Base de Datos", code: "DB" },
];

export default function DocumentMetadataCard({
  value,
  onChange,
  onDelete,
  index,
}) {
  const handleField = (field, val) =>
    onChange({ ...value, [field]: val }, index);

  return (
    <div className="flex flex-row gap-6 py-7 px-3 border-b border-gray-300 bg-white rounded-2xl mb-7 shadow-sm">
      {/* PDF/Word Preview */}
      <div className="flex-shrink-0 pt-2">
        <img
          src={value.thumbUrl || "https://placehold.co/120x150/pdf?text=Documento"}
          alt={`Vista previa del archivo ${value.file?.name || ""}`}
          className="w-[120px] h-[150px] object-cover border border-gray-300 rounded bg-white"
        />
      </div>
      {/* Metadata form */}
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
          {/* Área */}
          <div>
            <label className="block text-[15px] text-black font-semibold mb-1">
              Área <span className="text-[#e11d1d]">*</span>
            </label>
            <Dropdown
              value={value.area}
              options={AREAS}
              onChange={(e) => handleField("area", e.value)}
              optionLabel="name"
              placeholder="Seleccione un área"
              className="w-full border border-black rounded"
              style={{ color: "#e11d1d" }}
              panelClassName="bg-white border-black"
            />
          </div>
          {/* Fecha de creación */}
          <div>
            <label className="block text-[15px] text-black font-semibold mb-1">
              Fecha de creación <span className="text-[#e11d1d]">*</span>
            </label>
            <Calendar
              value={value.creationDate}
              onChange={(e) => handleField("creationDate", e.value)}
              dateFormat="yy-mm-dd"
              showIcon
              className="w-full border border-black rounded"
              placeholder="YYYY-MM-DD"
            />
          </div>
          {/* Título */}
          <div>
            <label className="block text-[15px] text-black font-semibold mb-1">
              Título <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={value.title}
              maxLength={60}
              onChange={(e) => handleField("title", e.target.value)}
              className="w-full border border-black rounded"
              placeholder="Título del documento"
            />
            <div className="text-right text-xs text-gray-500">
              {value.title?.length || 0}/60
            </div>
          </div>
          {/* Tema */}
          <div>
            <label className="block text-[15px] text-black font-semibold mb-1">
              Tema <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={value.topic}
              maxLength={40}
              onChange={(e) => handleField("topic", e.target.value)}
              className="w-full border border-black rounded"
              placeholder="Tema principal"
            />
          </div>
          {/* Autor */}
          <div>
            <label className="block text-[15px] text-black font-semibold mb-1">
              Autor <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={value.author}
              maxLength={40}
              onChange={(e) => handleField("author", e.target.value)}
              className="w-full border border-black rounded"
              placeholder="Nombre del autor"
            />
          </div>
        </div>

        {/* Nombre de archivo y acciones */}
        <div className="flex items-center mt-6">
          <div className="flex-grow">
            <span className="text-gray-500 text-[13px]">
              {value.file?.name || "Sin archivo seleccionado"}
            </span>
            {value.file && (
              <span className="text-gray-400 text-[12px] ml-2">
                ({Math.round(value.file.size / 1024)} KB)
              </span>
            )}
          </div>
          <Button
            icon="pi pi-trash"
            className="p-button-text text-[#e11d1d] hover:bg-[#fee2e2] hover:text-[#b91c1c] rounded"
            onClick={() => onDelete(index)}
            tooltip="Eliminar documento"
            tooltipOptions={{ position: "left" }}
          />
        </div>
      </div>
    </div>
  );
}
