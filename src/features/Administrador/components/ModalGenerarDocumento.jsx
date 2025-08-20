import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { getPlantillas } from "@/services/plantilla.service";
import { defensaAdapter } from "../../../adapters/defensa.adapter";
const ModalGenerarDocumento = ({ visible, onHide, defensa }) => {
  if (visible) { 
    console.log(defensa);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [plantillasDat, setPlantillasDat] = useState([]); 
  const {crearObjeto} = defensaAdapter();
  const [loading, setLoading] = useState(false);
 
useEffect(() => {
  if (visible) {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const response = await getPlantillas();
        const datosReales = response?.response?.data || [];
        setPlantillasDat(datosReales);

      } catch (error) {
        console.error("Error al cargar las plantillas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }
}, [visible]);

  const handleClose = () => {
    setSelectedTemplate(null);
    onHide();
  };

  const generarDocumento = () => {
    crearObjeto(defensa, selectedTemplate);
  }
  const footerContent = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleClose}
        className="p-button-text"
      />
      <Button
        label="Generar"
        icon="pi pi-check"
        disabled={!selectedTemplate || loading}
        autoFocus
        onClick={generarDocumento}
      />
    </div>
  );

  return (
    <Dialog
      header={`Generar Documento para: ${defensa?.estudiante || ""}`}
      visible={visible}
      style={{ width: "40vw" }}
      onHide={handleClose}
      footer={footerContent}
      modal
    >
      <Dropdown
        id="templateDropdown"
        value={selectedTemplate}
        onChange={(e) => {setSelectedTemplate(e.value); } }
        options={plantillasDat} 
        optionLabel="nombre"
        optionValue="id_plantilla" 
        placeholder="Elige una plantilla para el documento"
        className="w-full"
        loading={loading}
      />
    </Dialog>
  ); }
};

export default ModalGenerarDocumento;