import ManagementLayout from "@/components/administradorContenido";
import SubirPlantilla from "@/features/Administrador/components/subir_plantilla";
import { usePlantillaStore } from "../../../store/plantilla.store";
import { FileUpload } from "primereact/fileupload";
import {useEffect, useState} from 'react';
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import { moduloStore } from "../../../store/modulos.store";
// import { file } from "jszip"; // Eliminado: causaba confusión con variable de archivo local

const getFileName = (filePath) => {
    return filePath.split(/[\\/]/).pop();
  };

function FileCard({ icon, color, title, category, uploaded, onEdit, onDelete, onDownload }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-5 min-w-[320px] max-w-[340px] h-[178px] mb-5 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <i className={`far ${icon} ${color} text-2xl`} aria-hidden="true"></i>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-blue-600" onClick={onEdit}>
            <i className="fas fa-pen text-lg"></i>
          </button>
          <button className="text-red-400 hover:text-red-600" onClick={onDelete}>
            <i className="fas fa-trash-alt text-lg"></i>
          </button>
        </div>
      </div>
      <div className="mt-3">
        <div className="font-semibold text-gray-800 text-base leading-tight truncate max-w-[250px]">
          {title}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Category: <span className="text-gray-500">{category}</span>
        </div>
        <div className="text-xs text-gray-400">
          Uploaded: <span className="text-gray-500">{uploaded}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDownload}
        className="flex items-center justify-center w-full mt-auto rounded-lg border border-gray-200 bg-[#f7fafd] hover:bg-gray-200 active:scale-[0.98] text-gray-700 py-2 text-sm font-medium transition-all duration-100"
      >
        <i className="fas fa-download mr-2"></i> Download
      </button>
    </div>
  );
}

function Plantillas() {
  const {plantillas, obtenerPlantillas, eliminarPlantilla, actualizarPlantilla, descargarPlantilla} = usePlantillaStore();
  const [visibleModal, setVisibleModal] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [plantillaToDelete, setPlantillaToDelete] = useState(null);
  const {obtenerModulos, modulos} = moduloStore();
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [options, setOptions] = useState([]);
  const onSubmitEditForm = async (e) => {
    e.preventDefault();
    if (!plantillaEditando) return;
    const formdataEditPlantilla = new FormData();
    formdataEditPlantilla.append("nombre_archivo", nombrePlantilla || "");
    formdataEditPlantilla.append("id_modulo", moduloSeleccionado ?? "");
    if (archivoNuevo) {
      formdataEditPlantilla.append("file", archivoNuevo);
    }
    try {
      await actualizarPlantilla(plantillaEditando, formdataEditPlantilla);
      await obtenerPlantillas();
      setVisibleModal(false);
      setArchivoNuevo(null);
    } catch (err) {
      console.error("Error actualizando plantilla:", err);
    }
  }
  useEffect(()=> {
    obtenerModulos();
  }, [obtenerModulos]); 
   const confirmDelete = () => {
    if (plantillaToDelete) {
      eliminarPlantilla(plantillaToDelete);      
      setDeleteModalOpen(false);
      setPlantillaToDelete(null);

    }
  };
    const deleteModalFooter = (
    <div className="pt-4 border-t border-gray-200">
      <button
        onClick={() => setDeleteModalOpen(false)}
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Cancelar
      </button>
      <button
        onClick={confirmDelete}
        className="px-4 py-2 ml-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        Sí, eliminar
      </button>
    </div>
  );
  useEffect(()=> { 
    obtenerPlantillas();    
    obtenerModulos();
    console.log("Obteniendo modulos");

  }, [obtenerPlantillas, obtenerModulos]);
useEffect(()=> { 
 setOptions(modulos.map(modulo => ({
  label: modulo.Nombre,
  value: modulo.Id_Modulo     
})) || []);  
 }, [modulos]);
  const handleEdit = (plantillaId, plantilla) => { 
    setPlantillaEditando(plantillaId);
    setNombrePlantilla(plantilla?.nombre_archivo || "");
    setModuloSeleccionado(plantilla?.id_modulo ?? null);
    setArchivoNuevo(null);
    setVisibleModal(true);
  } 
  const handleDelete = (plantilla, nombre) => {
  setNombrePlantilla(nombre);
  setPlantillaToDelete(plantilla);
  setDeleteModalOpen(true);
};
  const actions = [
    <div key="search" className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        placeholder="Search"
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>,
    <SubirPlantilla
      onUpload={(data) => console.log("Plantilla subida:", data)}
    />,
  ];
  return (
    <ManagementLayout title="Gestión de Plantillas" actions={actions}>
      {/* Dialog para eliminar*/}
       <Dialog
        header="Confirmar Eliminación"
        visible={isDeleteModalOpen}
  style={{ inlineSize: '30rem' }} 
        modal 
        footer={deleteModalFooter}
        onHide={() => setDeleteModalOpen(false)}
      >
        <div className="flex items-center">
          <i className="fas fa-exclamation-triangle text-3xl text-red-500 mr-4"></i>
          <div>
            <p className="font-bold">
              ¿Estás seguro de que deseas eliminar la plantilla?
            </p>
            <p className="text-gray-600 mt-1">
             "{nombrePlantilla}"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>  
        </div>
      </Dialog>
      {/* Dialog para editar*/}
      <Dialog 
        visible={visibleModal} 
        onHide={() => setVisibleModal(false)} 
        closable={false}
        className="max-w-lg w-full " 
        pt={{ 
                  root: { className: 'rounded-xl overflow-hidden border-none shadow-2xl' }, 

         header: { className: 'p-0 border-0' }, 
        title: { className: 'hidden' },
        icons: { className: 'hidden' },      
        content: { className: 'p-0' }
        }}
        header={
          <div className="flex items-center justify-between w-full bg-red-600 text-white px-5 py-3 rounded-t-xl">
            <h2 className="text-lg font-bold m-0">{plantillaEditando ? 'Editar plantilla' : 'Plantilla'}</h2>      
            <button 
              type="button" 
              onClick={() => setVisibleModal(false)}
              className="p-1 rounded hover:bg-red-500/40 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        }
        
      >
      <form onSubmit={e =>  onSubmitEditForm(e) }> 
  <div className="p-6 space-y-6">
    <div>
      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
        Nombre de la Plantilla
      </label>
      <input 
      value={nombrePlantilla}
      onChange={(e) => setNombrePlantilla(e.target.value)}
        id="nombre"
        type="text" 
        placeholder="Ej: Informe Mensual"
        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
    <div>
      <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
        Categoría
      </label>
        <Dropdown
      value={moduloSeleccionado}
      options={options} 
      onChange={(e) => setModuloSeleccionado(e.value)}
      placeholder="Selecciona una plantilla"
      filter
      showClear
      className="w-full md:w-14rem" 
    />
    </div>
    <FileUpload 
      mode="basic"
      name="file"
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      chooseLabel={archivoNuevo ? "Reemplazar archivo" : "Seleccionar nuevo archivo"}
      onSelect={(e)=> setArchivoNuevo(e.files?.[0] || null)}
      onClear={()=> setArchivoNuevo(null)}
      className="mt-2"
    />
  </div>
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-x-3 rounded-b-xl">
    <button
      onClick={(e) => {e.preventDefault(); setVisibleModal(false);} }
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
    >
      Cancelar
    </button>
    <button
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
    >
      Guardar Cambios
    </button>
  </div> </form>
      </Dialog>
      <div className="w-full h-full min-h-[80vh] bg-[#f7fafd] rounded-2xl p-4">
        <div className="flex flex-wrap gap-x-7 gap-y-6">
            {plantillas?.data?.map((file) => {
            let icon = 'fa-file-alt'; 
            let color = 'text-gray-500';
            let category = 'Archivo';

            const filePath = file.ruta_archivo.toLowerCase();

            if (filePath.endsWith('.docx')) {
              icon = 'fa-file-word';
              color = 'text-blue-600';
              category = 'Documento de Word';
            } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
              icon = 'fa-file-excel';
              color = 'text-green-600'; 
              category = 'Hoja de Cálculo';
            }

            const uploadDate = new Date(file.created_at).toLocaleDateString('es-ES');

            return (
              <FileCard
                key={file.id_plantilla}
                title={file.nombre_archivo}
                uploaded={uploadDate}
                icon={icon}
                color={color}
                category={category}
                onEdit={()=> handleEdit(file.id_plantilla, file)}
                onDelete={()=> handleDelete(file.id_plantilla, file.nombre_archivo)}
                onDownload={()=> descargarPlantilla(file.id_plantilla)} />
            );
          })}
          <div className="invisible min-w-[320px] max-w-[340px] h-[178px]"></div>
        </div>
      </div>
    </ManagementLayout>
  );
}

export default Plantillas;
