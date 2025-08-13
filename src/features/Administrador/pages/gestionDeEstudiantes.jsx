import React, { useState } from "react";
import ManagementLayout from "@/components/administradorContenido";
import RegistrarEstudiante from "@/features/Administrador/components/gestionEstudiantes/modal-registroEstudiante";
import ImportarEstudiantesExcel from "@/features/Administrador/components/importarEstudiante";
import FechaDefensa from "@/features/Administrador/components/gestionEstudiantes/modal-fechaDefensa";
import InputBuscar from "@/components/searchInput";
import ConfirmDeleteModal from "@/features/Administrador/components/common/ConfirmDeleteModal";

import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";

import { useEstudiantesStore } from "@/store/estudiantes.store";
import usePaginatedSearch from "@/features/Administrador/hooks/gestionEstudiantes/usePaginatedSearch";

import StudentRow from "@/features/Administrador/components/gestionEstudiantes/StudentRow";
import useConfirmDelete from "../hooks/gestionEstudiantes/useConfirmDelete";

export default function EstudiantesPage() {
  const [activeTab, setActiveTab] = useState("ExamendeGrado");
  const [selected, setSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);

  const { estudiantes, cargarEstudiantes, total, borrarEstudiante } =
    useEstudiantesStore();

  const {
    page, pageSize, searchTerm, setSearchTerm, onPageChange,
  } = usePaginatedSearch({
    activeTab,
    activeKey: "ExamendeGrado",
    initialPage: 1,
    initialPageSize: 10,
    loader: cargarEstudiantes,
  });

  const { confirmOpen, toDelete, askDelete, close } = useConfirmDelete();

  const onConfirmDelete = async () => {
    if (!toDelete.id) return;
    await borrarEstudiante(toDelete.id);
    await cargarEstudiantes(page, pageSize, searchTerm);
  };

  const tabs = [
    { key: "ExamendeGrado", label: "Examen de Grado" },
    { key: "ProyectodeGrado", label: "Proyecto de Grado" },
    { key: "Tesis", label: "Tesis" },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const actions = {
    ExamendeGrado: [
      <InputBuscar
        key="search"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar Estudiante.."
      />,
      <Button
        key="nuevo"
        onClick={() => {
          setModalVisible(true);
          setEstudianteAEditar(null);
        }}
        style={{ backgroundColor: "#e11d1d", margin: "10px" }}
      >
        Nuevo Estudiante
      </Button>,
      <ImportarEstudiantesExcel
        key="importar"
        onImport={(estudiantesImportados) => {
          console.log("Estudiantes importados:", estudiantesImportados);
        }}
      />,
      <FechaDefensa
        key="asignar"
        estudianteIds={selected}
        triggerLabel="Asignar Defensa"
        onSubmit={(data) => console.log(data)}
        disabled={selected.length <= 1}
      />,
    ],
  };

  return (
    <ManagementLayout
      title="Gestión de Estudiantes"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      actions={actions}
    >
      {activeTab === "ExamendeGrado" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres Completo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrera</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defensa Interna</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defensa Externa</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {estudiantes.map((student) => (
                <StudentRow
                  key={student.id_estudiante}
                  student={student}
                  selected={selected}
                  onToggle={toggleSelect}
                  setEstudianteAEditar={setEstudianteAEditar}
                  setModalVisible={setModalVisible}
                  cargarEstudiantes={cargarEstudiantes}
                  page={page}
                  pageSize={pageSize}
                  onAskDelete={askDelete}
                />
              ))}
            </tbody>
          </table>

          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={total}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>

          <RegistrarEstudiante
            visible={modalVisible}
            setVisible={setModalVisible}
            estudianteEditar={estudianteAEditar}
            onSuccess={() => cargarEstudiantes(page, pageSize, "")}
          />

          <ConfirmDeleteModal
            open={confirmOpen}
            name={toDelete.name}
            entityLabel="estudiante"
            onClose={close}
            onConfirm={onConfirmDelete}
          />
        </>
      )}
    </ManagementLayout>
  );
}
