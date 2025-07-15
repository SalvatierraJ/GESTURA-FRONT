import React, { useState, useEffect } from "react";
import ManagementLayout from "@/components/administradorContenido";
import Horario from "@/features/Administrador/components/modal-horario";
import Contratos from "@/features/Administrador/components/modal-contrato";
import NuevoDocente from "@/features/Administrador/components/modal-nuevoDocente";
import { useDocentesStore } from "@/store/docentes.store";
import InputBuscar from "@/components/searchInput";
import { Paginator } from "primereact/paginator";
const TeacherRow = ({ docente, handleEditar, actualizarEstadoDocente,cargarDocentes }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{docente.id_tribunal}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{docente.Nombre}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{docente.Apellido}, </td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {(docente.areas || []).map((a) => a.nombre_area).join(", ")}
    </td>{" "}
    <td className="px-4 py-3">
      {docente.estado == true ? (
        <span
          className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full cursor-pointer"
          onClick={async () => {
            await actualizarEstadoDocente({
              id: docente.id_tribunal,
              estado: false,
            });
            cargarDocentes(1,10)
          }}
        >
          Activo
        </span>
      ) : (
        <span
          className="text-xs font-semibold text-red-800 bg-red-200 px-2 py-1 rounded-full cursor-pointer"
          onClick={async () => {
            await actualizarEstadoDocente({
              id: docente.id_tribunal,
              estado: true,
            });
            cargarDocentes(1,10)
          }}
        >
          Inactivo
        </span>
      )}
    </td>
    <td className="px-4 py-3 text-center space-x-3">
      <button
        className="text-black hover:red-600 cursor-pointer"
        onClick={() => handleEditar(docente)}
      >
        <i className="fas fa-edit"></i>
      </button>
      <Horario />
    </td>
  </tr>
);

const TeacherContract = ({ teacher }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.firstName}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.lastName}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.typeContract}</td>
    <td className="px-4 py-3 text-center space-x-2">
      <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
        <i className="fas fa-edit"></i>
      </span>
      <Contratos />
    </td>
  </tr>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("docentes");
  const {
    cargarDocentes,
    docentes,
    page,
    pageSize,
    total,
    loading,
    actualizarEstadoDocente,
  } = useDocentesStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const [docenteAEditar, setDocenteAEditar] = useState(null);
  const handleCrear = () => {
    setDocenteAEditar(null);
    setModalDocenteVisible(true);
  };
  const handleEditar = (docente) => {
    setDocenteAEditar(docente);
    setModalDocenteVisible(true);
  };
  useEffect(() => {
    cargarDocentes(page, pageSize);
  }, [page, pageSize, cargarDocentes]);

  const onPageChange = (event) => {
    cargarDocentes(event.page + 1, event.rows);
  };

  const filteredDocentes = docentes.filter((c) =>
    (c.Nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const tabs = [
    { key: "docentes", label: "Docentes" },
    { key: "contratos", label: "Contratos" },
  ];

  const actions = {
    docentes: [
      <InputBuscar
        key="search"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar Docente..."
      />,
      <NuevoDocente
        visible={modalDocenteVisible}
        setVisible={setModalDocenteVisible}
        docenteEditar={docenteAEditar}
        onSuccess={() => {
          cargarDocentes(page, pageSize);
        }}
      />,
      <button
        key="jurado"
        className="bg-white border border-red-600 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50"
      >
        Solicitar Jurado Externo
      </button>,
    ],
  };

  return (
    <ManagementLayout
      title="Gestión de Docentes"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      actions={actions}
    >
      {activeTab === "docentes" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombres
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellidos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área de Especialización
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo Jurado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocentes.map((docente) => (
                <TeacherRow
                  key={docente.id_tribunal}
                  docente={docente}
                  handleEditar={handleEditar}
                  actualizarEstadoDocente={actualizarEstadoDocente}
                  cargarDocentes={cargarDocentes}
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
        </>
      )}

      {activeTab === "contratos" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apellidos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Contrato
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <TeacherContract key={teacher.id} teacher={teacher} />
            ))}
          </tbody>
        </table>
      )}
    </ManagementLayout>
  );
};

export default function MainLayout() {
  return <MainContent />;
}
