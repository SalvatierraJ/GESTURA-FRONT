import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { useCasosStore } from "@/store/casos.store";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function RegistroDocumentoModal() {
  const [visible, setVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [touched, setTouched] = useState(false);
  const toast = useRef(null);
  const { areas, cargarAreasEstudio } = useCasosStore();
  const crearCasos = useCasosStore((s) => s.crearCasos);
  const [saving, setSaving] = useState(false);

  const fileUploadRef = useRef(null);
  const abrirModal = () => {
    cargarAreasEstudio(1, 100);
    setVisible(true);
  };

  const areasDropdown = (areas || []).map((f) => ({
    name: f.nombre_area,
    code: f.id_area,
  }));
  const extractMetadata = async (file) => {
    // PDF
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = async (event) => {
          try {
            const typedarray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedarray })
              .promise;
            const meta = await pdf.getMetadata();
            let creationDate = null;
            if (meta.info.CreationDate) {
              const match = meta.info.CreationDate.match(
                /D:(\d{4})(\d{2})(\d{2})/
              );
              if (match) {
                creationDate = new Date(
                  `${match[1]}-${match[2]}-${match[3]}T00:00:00`
                );
              }
            }
            resolve({
              title: meta.info.Title || file.name.replace(/\.[^/.]+$/, ""),
              author: meta.info.Author || "",
              topic: meta.info.Subject || "",
              creationDate,
            });
          } catch {
            resolve({
              title: file.name.replace(/\.[^/.]+$/, ""),
              author: "",
              topic: "",
              creationDate: null,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
    // DOCX
    if (file.name.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const coreXml = await zip.file("docProps/core.xml")?.async("string");
      if (coreXml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(coreXml, "text/xml");
        const getVal = (tag) =>
          xmlDoc.getElementsByTagName(tag)[0]?.textContent || "";
        const created = getVal("dcterms:created");
        return {
          title: getVal("dc:title") || file.name.replace(/\.[^/.]+$/, ""),
          author: getVal("dc:creator") || "",
          topic: getVal("cp:subject") || "",
          creationDate: created ? new Date(created) : null,
        };
      }
      return {
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: "",
        topic: "",
        creationDate: null,
      };
    }

    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      author: "",
      topic: "",
      creationDate: null,
    };
  };

  // Handler cuando seleccionan archivos
  const onSelect = async (e) => {
    // e.files es un array (por multiple={true})
    const nuevosDocs = await Promise.all(
      e.files.map(async (file) => {
        const meta = await extractMetadata(file);
        return {
          file,
          ...meta,
        };
      })
    );
    setDocumentos(nuevosDocs);
  };

  // Limpiar archivos
  const onClear = () => setDocumentos([]);

  // Cambiar campos manualmente
  const updateDocumento = (i, key, value) => {
    setDocumentos((prev) =>
      prev.map((doc, idx) => (idx === i ? { ...doc, [key]: value } : doc))
    );
  };

  // Enviar
  const onRegister = async () => {
    setTouched(true);
    // Valida cada doc
    const vacio = documentos.some(
      (doc) =>
        !doc.title.trim() ||
        !doc.author.trim() ||
        !doc.topic.trim() ||
        !doc.creationDate
    );
    if (!selectedArea || documentos.length === 0 || vacio) {
      toast.current.show({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Completa todos los campos de todos los documentos",
      });
      return;
    }
    //logica de envio de documentos al backend con metadata abierta al acambio
    const archivos = documentos.map((doc) => ({
      file: doc.file,
      titulo: doc.title,
      fecha_subida:
        doc.creationDate instanceof Date
          ? doc.creationDate.toISOString().slice(0, 10) // yyyy-mm-dd
          : doc.creationDate,
      autor: doc.author,
      tema: doc.topic,
    }));
    const id_area = selectedArea.code;

    try {
      await crearCasos({ id_area, archivos });
      toast.current.show({
        severity: "success",
        summary: "Registrado",
        detail: "Documentos registrados exitosamente",
      });
      setVisible(false);
      setSelectedArea(null);
      setDocumentos([]);
      setTouched(false);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Error al registrar los documentos",
      });
    }
  };
  const resetModal = () => {
    setSelectedArea(null);
    setDocumentos([]);
    setTouched(false);
    setVisible(false);
  };
  // Header
  const header = (
    <div
      className="rounded-t-2xl flex items-center gap-3"
      style={{
        width: "110%",
        background: "rgb(225, 29, 29)",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-25px",
      }}
    >
      <i className="pi pi-file text-2xl" />
      <span className="text-2xl font-extrabold tracking-wide">
        Subir Documentos
      </span>
    </div>
  );
  const customHeaderTemplate = (options) => (
    <div className="p-fileupload-buttonbar flex items-center gap-2">
      {options.chooseButton}
    </div>
  );

  return (
    <div>
      <>
        <Toast ref={toast} />
        <Button
          key="nuevo"
          icon="pi pi-plus"
          label="Subir Documentos"
          onClick={() => {
            abrirModal();
          }}
          className="mb-4 px-6 py-3 font-bold rounded-full text-lg border-none"
          style={{ background: "#e11d1d", color: "#fff" }}
        />
        <Dialog
          header={header}
          visible={visible}
          style={{
            width: "900px", // más ancho para muchos inputs
            maxWidth: "98vw",
            display: "flex",
            justifyContent: "center",
          }}
          modal
          draggable={false}
          onHide={resetModal}
          contentClassName="bg-white rounded-b-2xl p-0"
          className="rounded-2xl"
        >
          {areas.length === 0 ? (
            <div className="text-center p-5">
              <p className="text-lg font-semibold text-black mb-2">
                Para subir casos, primero debe agregar al menos un área de
                estudio.
              </p>
              <p className="text-gray-700 mb-3">
                Diríjase a la sección <b>Áreas</b> y registre un área antes de
                continuar.
              </p>
              <i
                className="pi pi-ban text-6xl"
                style={{ color: "#e11d1d" }}
              ></i>
              <div className="flex justify-end pt-2 mt-4">
                <Button
                  label="Cerrar"
                  icon="pi pi-times"
                  style={{
                    background: "#e11d1d",
                    color: "#fff",
                    border: "none",
                  }}
                  className="font-semibold"
                  onClick={resetModal}
                />
              </div>
            </div>
          ) : (
            <div className="px-10 pt-7 pb-5 relative">
              {saving && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                  <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mr-3" />
                  <span className="text-[#e11d1d] text-lg font-semibold">
                    Guardando documentos...
                  </span>
                </div>
              )}
              <form
                className="flex flex-col gap-7"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  await onRegister();
                  setSaving(false);
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
                    disabled={saving}
                  />
                  {touched && !selectedArea && (
                    <small className="text-[#e11d1d]">
                      Selecciona un área.
                    </small>
                  )}
                </div>

                {/* FileUpload */}
                <div>
                  <label className="block text-black font-semibold mb-2">
                    Documentos <span className="text-[#e11d1d]">*</span>
                  </label>
                  <FileUpload
                    ref={fileUploadRef}
                    name="file"
                    accept=".pdf,.docx"
                    maxFileSize={5_000_000}
                    multiple
                    onSelect={onSelect}
                    onError={onClear}
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
                    headerTemplate={customHeaderTemplate}
                    disabled={saving}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    (PDF o Word, máximo 5MB cada uno)
                  </div>
                  {touched && documentos.length === 0 && (
                    <small className="text-[#e11d1d]">
                      Adjunta al menos un documento.
                    </small>
                  )}
                </div>

                {/* Inputs dinámicos por archivo */}
                {documentos.length > 0 && (
                  <div className="flex flex-col gap-6">
                    {documentos.map((doc, i) => (
                      <div
                        key={doc.file.name + i}
                        className="border border-black rounded-lg p-4 bg-[#f8f8f8]"
                      >
                        <div className="font-bold text-lg mb-3 text-[#e11d1d]">
                          {doc.file.name}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Título */}
                          <div>
                            <label className="block text-black font-semibold mb-1">
                              Título <span className="text-[#e11d1d]">*</span>
                            </label>
                            <InputText
                              value={doc.title}
                              onChange={(e) =>
                                updateDocumento(i, "title", e.target.value)
                              }
                              className="w-full border border-black rounded"
                              disabled={saving}
                            />
                            {touched && !doc.title.trim() && (
                              <small className="text-[#e11d1d]">
                                Obligatorio
                              </small>
                            )}
                          </div>
                          {/* Autor */}
                          <div>
                            <label className="block text-black font-semibold mb-1">
                              Autor <span className="text-[#e11d1d]">*</span>
                            </label>
                            <InputText
                              value={doc.author}
                              onChange={(e) =>
                                updateDocumento(i, "author", e.target.value)
                              }
                              className="w-full border border-black rounded"
                              disabled={saving}
                            />
                            {touched && !doc.author.trim() && (
                              <small className="text-[#e11d1d]">
                                Obligatorio
                              </small>
                            )}
                          </div>
                          {/* Tema */}
                          <div>
                            <label className="block text-black font-semibold mb-1">
                              Tema <span className="text-[#e11d1d]">*</span>
                            </label>
                            <InputText
                              value={doc.topic}
                              onChange={(e) =>
                                updateDocumento(i, "topic", e.target.value)
                              }
                              className="w-full border border-black rounded"
                              disabled={saving}
                            />
                            {touched && !doc.topic.trim() && (
                              <small className="text-[#e11d1d]">
                                Obligatorio
                              </small>
                            )}
                          </div>
                          {/* Fecha */}
                          <div>
                            <label className="block text-black font-semibold mb-1">
                              Fecha de creación{" "}
                              <span className="text-[#e11d1d]">*</span>
                            </label>
                            <Calendar
                              value={doc.creationDate}
                              onChange={(e) =>
                                updateDocumento(i, "creationDate", e.value)
                              }
                              dateFormat="yy-mm-dd"
                              showIcon
                              className="w-full border border-black rounded"
                              disabled={saving}
                            />
                            {touched && !doc.creationDate && (
                              <small className="text-[#e11d1d]">
                                Obligatorio
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-2 pb-2">
                  <Button
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-text font-semibold text-black border-none"
                    onClick={resetModal}
                    style={{
                      color: "#e11d1d",
                    }}
                    disabled={saving}
                  />
                  <Button
                    type="submit"
                    label="Registrar"
                    icon="pi pi-check"
                    className="font-semibold border-none"
                    style={{
                      background: "#e11d1d",
                      color: "#fff",
                      boxShadow: "0 2px 12px -2px #e11d1d44",
                    }}
                    disabled={saving}
                  />
                </div>
              </form>
            </div>
          )}
          ;
        </Dialog>
      </>
    </div>
  );
}
