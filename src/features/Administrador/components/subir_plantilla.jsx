import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

const CATEGORIAS = [
  { label: "Offer Letter", value: "Offer Letter" },
  { label: "Internship Agreement", value: "Internship Agreement" },
  { label: "Non-Disclosure Agreement", value: "Non-Disclosure Agreement" },
  { label: "Other", value: "Other" },
];

export default function DialogSubirPlantilla({ onUpload }) {
  const [visible, setVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [touched, setTouched] = useState({});
  const toast = useRef();

  const handleSelectFile = (e) => {
    setArchivo(e.files?.[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ titulo: true, categoria: true, archivo: true });

    if (!titulo.trim() || !categoria || !archivo) return;

    // Simulación de upload, puedes reemplazar por tu lógica real
    if (onUpload) {
      onUpload({ titulo, categoria, archivo });
    }
    toast.current.show({
      severity: "success",
      summary: "Plantilla subida",
      detail: `Se subió: ${titulo}`,
    });
    setVisible(false);
    setTitulo("");
    setCategoria(null);
    setArchivo(null);
    setTouched({});
  };

  const header = (
    <div
      className="flex items-center rounded-t-2xl justify-between px-6 py-4"
      style={{
        width: "124%",
        background: "#e11d1d",
        color: "white",
        padding: "1.5rem 2rem 1.2rem",
        marginTop: "-2rem",
        marginLeft: "-26px",
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-upload text-2xl text-white" />
        <span className="text-2xl font-extrabold tracking-wide text-white">
          Subir Plantilla
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Button
        icon="pi pi-upload"
        label="Subir Plantilla"
        onClick={() => setVisible(true)}
        className="px-6 py-3 font-bold rounded-full text-lg border-none mb-4"
        style={{ background: "#e11d1d", color: "#fff" }}
      />

      <Dialog
        header={header}
        visible={visible}
        style={{ width: "430px", maxWidth: "97vw" }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
        contentClassName="bg-white rounded-b-2xl p-0"
        className="rounded-2xl"
      >
        <form className="px-7 pt-6 pb-3 flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-black font-semibold mb-2">
              Título de la plantilla <span className="text-[#e11d1d]">*</span>
            </label>
            <InputText
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className={`w-full border-black rounded ${touched.titulo && !titulo.trim() ? "p-invalid" : ""}`}
              onBlur={() => setTouched(t => ({ ...t, titulo: true }))}
              placeholder="Ej: Offer Letter Template V2"
            />
            {touched.titulo && !titulo.trim() && (
              <small className="text-[#e11d1d]">El título es obligatorio.</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-2">
              Categoría <span className="text-[#e11d1d]">*</span>
            </label>
            <Dropdown
              value={categoria}
              options={CATEGORIAS}
              onChange={e => setCategoria(e.value)}
              className={`w-full border-black rounded ${touched.categoria && !categoria ? "p-invalid" : ""}`}
              placeholder="Selecciona una categoría"
              onBlur={() => setTouched(t => ({ ...t, categoria: true }))}
              filter
            />
            {touched.categoria && !categoria && (
              <small className="text-[#e11d1d]">Selecciona una categoría.</small>
            )}
          </div>
          <div>
            <label className="block text-black font-semibold mb-2">
              Archivo <span className="text-[#e11d1d]">*</span>
            </label>
            <FileUpload
              mode="basic"
              name="file"
              accept=".pdf,.doc,.docx"
              maxFileSize={4000000}
              chooseLabel="Seleccionar archivo"
              className={`border-black rounded w-full ${touched.archivo && !archivo ? "p-invalid" : ""}`}
              customUpload
              auto={false}
              uploadHandler={() => {}}
              onSelect={handleSelectFile}
              onClear={() => setArchivo(null)}
              emptyTemplate={<p className="m-0">Arrastra y suelta aquí o haz click</p>}
            />
            {touched.archivo && !archivo && (
              <small className="text-[#e11d1d]">El archivo es obligatorio.</small>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 pb-2">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text font-semibold"
              style={{ color: "#e11d1d", border: "none" }}
              onClick={() => setVisible(false)}
            />
            <Button
              type="submit"
              label="Subir"
              icon="pi pi-check"
              className="font-semibold border-none"
              style={{
                background: "#e11d1d",
                color: "#fff",
                boxShadow: "0 2px 12px -2px #e11d1d44",
              }}
              disabled={!titulo.trim() || !categoria || !archivo}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
