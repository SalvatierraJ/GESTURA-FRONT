import React, { useState } from "react";
import { useEffect } from "react";
import ManagementLayout from "@/components/administradorContenido";
import RegistrarCaso from "@/features/JefesDeCarrera/components/modal-casos";
import RegistrarArea from "@/features/JefesDeCarrera/components/modal-area";
import RegistrarCarrera from "@/features/JefesDeCarrera/components/modal-carrera";
import InputBuscar from "@/components/searchInput";
import { useCasosStore } from "@/store/casos.store";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";

const TeacherRow = ({ teacher }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.firstName}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.lastName}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{teacher.specialty}</td>
    <td className="px-4 py-3">
      <button className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
        {teacher.status}
      </button>
    </td>
    <td className="px-4 py-3 text-center space-x-2">
      <button className="text-blue-600 hover:text-blue-800">
        <i className="fas fa-edit"></i>
      </button>
    </td>
  </tr>
);

const FilaCarreras = ({
  carrera,
  onEditar,
  actualizarEstadoCarrera,
  cargarCarreras,
}) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{carrera.id_carrera}</td>
    <td className="px-4 py-3 text-sm text-gray-700">
      {carrera.nombre_carrera}
    </td>
    <td className="px-4 py-3">
      {carrera.estado == true ? (
        <span
          className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full cursor-pointer"
          onClick={async () => {
            await actualizarEstadoCarrera({
              id: carrera.id_carrera,
              estado: false,
            });
            cargarCarreras();
          }}
        >
          Activo
        </span>
      ) : (
        <span
          className="text-xs font-semibold text-red-800 bg-red-200 px-2 py-1 rounded-full cursor-pointer"
          onClick={async () => {
            await actualizarEstadoCarrera({
              id: carrera.id_carrera,
              estado: true,
            });
            cargarCarreras();
          }}
        >
          Inactivo
        </span>
      )}
    </td>
    <td className="px-4 py-3 text-center space-x-2">
      <button onClick={onEditar}>
        <i className="fas fa-edit"></i>
      </button>
    </td>
  </tr>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("Casos");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    carreras,
    cargarCarreras,
    actualizarEstadoCarrera,
    loading,
    total,
    page,
    pageSize,
  } = useCasosStore();
  const [modalCarreraVisible, setModalCarreraVisible] = useState(false);
  const [carreraEditar, setCarreraEditar] = useState(null);
  const filteredCarreras = carreras.filter((c) =>
    (c.nombre_carrera || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    cargarCarreras(page, pageSize);
  }, [page, pageSize, cargarCarreras]);
  const onPageChange = (event) => {
    cargarCarreras(event.page + 1, event.rows);
  };
  const teachers = [
    {
      id: "01",
      firstName: "hernesto",
      lastName: "salaz",
      specialty: "Ingeniería de software",
      status: "Activo",
      typeContract: "Tiempo completo",
    },
    {
      id: "02",
      firstName: "judair",
      lastName: "salaz",
      specialty: "Redes",
      status: "Activo",
      typeContract: "Medio tiempo",
    },
    {
      id: "03",
      firstName: "elmepp",
      lastName: "salaz",
      specialty: "Redes",
      status: "Activo",
      typeContract: "Tiempo completo",
    },
  ];
  const tabs = [
    { key: "Casos", label: "Casos de Estudio", count: teachers.length },
    { key: "Areas", label: "Areas", count: teachers.length },
    { key: "Carrera", label: "Carreras", count: teachers.length },
  ];

  const actions = {
    Casos: [<RegistrarCaso />],
    Areas: [<RegistrarArea />],
    Carrera: [
      <InputBuscar
        key="search"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar carrera..."
      />,
      <RegistrarCarrera
        visible={modalCarreraVisible}
        setVisible={setModalCarreraVisible}
        carrera={carreraEditar}
        limpiarCarreraEditar={() => setCarreraEditar(null)}
      />,
      <Button
        className="mb-4 bg-red-700 text-white hover:bg-red-800"
        style={{ backgroundColor: "#e11d1d", hover: "#b91c1c" }}
        icon="pi pi-plus"
        label="Registrar Carrera"
        onClick={() => {
          setCarreraEditar(null);
          setModalCarreraVisible(true);
        }}
      />,
    ],
  };

  return (
    <ManagementLayout
      title="Gestión de Casos"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      actions={actions}
    >
      {activeTab === "Casos" && (
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
                Codigo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <TeacherRow key={teacher.id} teacher={teacher} />
            ))}
          </tbody>
        </table>
      )}
      {activeTab === "Areas" && (
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
                Estado
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <TeacherRow key={teacher.id} teacher={teacher} />
            ))}
          </tbody>
        </table>
      )}
      {activeTab === "Carrera" && (
        <div className="w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Carrera
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCarreras.map((carrera) => (
                <FilaCarreras
                  key={carrera.id_carrera}
                  carrera={carrera}
                  onEditar={() => {
                    setCarreraEditar(carrera);
                    setModalCarreraVisible(true);
                  }}
                  actualizarEstadoCarrera={actualizarEstadoCarrera}
                  cargarCarreras={cargarCarreras}
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
        </div>
      )}
    </ManagementLayout>
  );
};

export default function MainLayout() {
  return <MainContent />;
}
