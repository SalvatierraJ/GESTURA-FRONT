import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { useCasosStore } from "@/store/casos.store";
import { FileUpload } from "primereact/fileupload";

export default function ModalEditarCasoEstudio({
  visible,
  onHide,
  caso,
  onUpdateSuccess,
}) {
  const fileUploadRef = useRef(null);
  const toast = useRef(null);
  const { areas = [], cargarAreasEstudio } = useCasosStore();
  const actualizarCasoEstudio = useCasosStore((s) => s.actualizarCaso);

  const [selectedArea, setSelectedArea] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [tema, setTema] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [documento, setDocumento] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible && areas.length === 0) {
      cargarAreasEstudio(1, 100);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && caso) {
      setTitulo(caso.Nombre_Archivo || "");
      setAutor(caso.Autor || "");
      setTema(caso.Tema || "");
      setFechaCreacion(
        caso.Fecha_Creacion
          ? new Date(caso.Fecha_Creacion)
          : caso.fecha_Subida
            ? new Date(caso.fecha_Subida)
            : null
      );
      setSelectedArea(
        areas.find((a) => a.id_area === caso.id_area)
          ? {
            name: areas.find((a) => a.id_area === caso.id_area)?.nombre_area,
            code: caso.id_area,
          }
          : null
      );
      setDocumento(
        caso.documento
          ? {
            file: caso.documento.file || null,
            titulo: caso.documento.Nombre_Archivo || caso.documento.title || "",
            autor: caso.documento.Autor || "",
            tema: caso.documento.Tema || "",
            fecha_subida: caso.documento.Fecha_Creacion
              ? new Date(caso.documento.Fecha_Creacion)
              : caso.documento.fecha_Subida
                ? new Date(caso.documento.fecha_Subida)
                : null,
            url: caso.documento.url || "",
          }
          : null
      );
    }
  }, [visible, caso, areas, cargarAreasEstudio]);

  const handleUpdate = async () => {
    setTouched(true);
    if (!titulo.trim() || !autor.trim() || !tema.trim() || !fechaCreacion || !selectedArea || !documento?.file) {
      toast.current.show({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Completa todos los campos y adjunta un documento",
      });
      return;
    }

    try {
      const payload = {
        id_area: selectedArea?.code,
        documento,
        Titulo: titulo,
        Autor: autor,
        Tema: tema,
        Fecha_Creacion: fechaCreacion,
        url: caso.url,
      };
      console.log("Payload de actualización:", payload);
      
      await actualizarCasoEstudio(caso.id_casoEstudio, payload);

      toast.current.show({
        severity: "success",
        summary: "Actualizado",
        detail: "El caso de estudio ha sido actualizado exitosamente",
      });
      onUpdateSuccess && onUpdateSuccess();
      onHide();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Error al actualizar el caso",
      });
    }
  };

  const header = (
    <div
      className="rounded-t-2xl flex items-center gap-3"
      style={{
        width: "116%",
        background: "#e11d1d",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-25px",
      }}
    >
      <i className="pi pi-pencil text-2xl" />
      <span className="text-2xl font-extrabold tracking-wide">
        Editar Caso de Estudio
      </span>
    </div>
  );

  const onClear = () => setDocumento(null);

  const onSelect = (e) => {
    setDocumento({ file: e.files[0], title: e.files[0].name });
    toast.current.show({
      severity: "success",
      summary: "Archivo agregado",
      detail: `${e.files[0].name}`,
    });
  };

  const areasDropdown = areas.map((f) => ({
    name: f.nombre_area,
    code: f.id_area,
  }));

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={header}
        visible={visible}
        style={{
          width: "600px",
          maxWidth: "98vw",
          display: "flex",
          justifyContent: "center",
        }}
        modal
        draggable={false}
        onHide={onHide}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <div className="px-10 pt-7 pb-5">
          <form
            className="flex flex-col gap-7"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            {/* Área */}
            <div>
              <label className="block text-black font-semibold mb-1">
                Área <span className="text-[#e11d1d]">*</span>
              </label>
              <Dropdown
                value={selectedArea}
                options={areasDropdown}
                onChange={(e) => setSelectedArea(e.value)}
                optionLabel="name"
                placeholder="Seleccione un área"
                className="w-full border border-black rounded focus:ring-2 focus:ring-[#e11d1d]"
                style={{ color: "#e11d1d" }}
                panelClassName="bg-white border-black"
              />
              {touched && !selectedArea && (
                <small className="text-[#e11d1d]">Selecciona un área.</small>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div>
                <label className="block text-black font-semibold mb-1">
                  Título <span className="text-[#e11d1d]">*</span>
                </label>
                <InputText
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border border-black rounded"
                />
                {touched && !titulo.trim() && (
                  <small className="text-[#e11d1d]">Obligatorio</small>
                )}
              </div>

              {/* Autor */}
              <div>
                <label className="block text-black font-semibold mb-1">
                  Autor <span className="text-[#e11d1d]">*</span>
                </label>
                <InputText
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  className="w-full border border-black rounded"
                />
                {touched && !autor.trim() && (
                  <small className="text-[#e11d1d]">Obligatorio</small>
                )}
              </div>

              {/* Tema */}
              <div>
                <label className="block text-black font-semibold mb-1">
                  Tema <span className="text-[#e11d1d]">*</span>
                </label>
                <InputText
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full border border-black rounded"
                />
                {touched && !tema.trim() && (
                  <small className="text-[#e11d1d]">Obligatorio</small>
                )}
              </div>

              {/* Fecha de creación */}
              <div>
                <label className="block text-black font-semibold mb-1">
                  Fecha de creación <span className="text-[#e11d1d]">*</span>
                </label>
                <Calendar
                  value={fechaCreacion}
                  onChange={(e) => setFechaCreacion(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  className="w-full border border-black rounded"
                />
                {touched && !fechaCreacion && (
                  <small className="text-[#e11d1d]">Obligatorio</small>
                )}
              </div>
            </div>

            {/* Documento */}
            <div>
              <label className="block text-black font-semibold mb-2">
                Documento <span className="text-[#e11d1d]">*</span>
              </label>
              <FileUpload
                ref={fileUploadRef}
                name="file"
                accept=".pdf,.docx"
                maxFileSize={5_000_000}
                multiple={false}
                onSelect={onSelect}
                onClear={onClear}
                customUpload={false}
                className="w-full"
                style={{
                  border: "1.5px solid #e11d1d",
                  borderRadius: "0.5rem",
                  background: "#fff",
                }}
                chooseOptions={{
                  label: "Seleccionar",
                  icon: "pi pi-file",
                  className:
                    "p-button-outlined bg-white border border-[#e11d1d] text-[#e11d1d] hover:bg-[#e11d1d] hover:text-white",
                }}
              />
              <div className="text-xs text-gray-400 mt-1">
                (PDF o Word, máximo 5MB)
              </div>
              {touched && !documento?.file && (
                <small className="text-[#e11d1d]">Adjunta un documento.</small>
              )}
            </div>

            {/* Acciones principales */}
            <div className="flex justify-end gap-3 pt-2 pb-2">
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text font-semibold text-black border-none"
                onClick={onHide}
                style={{ color: "#e11d1d" }}
              />
              <Button
                type="submit"
                label="Actualizar"
                icon="pi pi-check"
                className="font-semibold border-none"
                style={{
                  background: "#e11d1d",
                  color: "#fff",
                  boxShadow: "0 2px 12px -2px #e11d1d44",
                }}
              />
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
