import ManagementLayout from "@/components/administradorContenido";
import RegistrarSecretario from "@/features/Administrador/components/modal-controlAcceso";
import Permiso from "@/features/Administrador/components/modal-Roles";
import { useState } from "react";

const Usuarios = ({ teacher }) => (
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

const Roles = ({ rol }) => (
  <tr className="border-b last:border-none hover:bg-gray-50">
    <td className="px-4 py-3 text-sm text-gray-700">{rol.id}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{rol.Name}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{rol.Permisos}</td>
    <td className="px-4 py-3 text-center space-x-2">
      <button className="text-blue-600 hover:text-blue-800">
        <i className="fas fa-edit"></i>
      </button>
    </td>
  </tr>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("Control");

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

  const rol = [
    {
      id: "01",
      Name: "Administrador",
      Permisos: "Total",
    },
    {
      id: "02",
      Name: "Secretario",
      Permisos: "Lectura y Escritura",
    },
    {
      id: "03",
      Name: "Auxiliar",
      Permisos: "Parcial(Consulta)",
    },
  ];

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
    <RegistrarSecretario />,
    <Permiso 
    />,
  ];
  const tabs = [
    {
      key: "Control",
      label: "Control de Acceso",
      count: teachers.length,
    },
    {
      key: "Rol",
      label: "Roles y Permisos",
      count: teachers.length,
    },
  ];

  return (
    <ManagementLayout
      title="Control de acceso"
      actions={actions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Control" && (
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
            {teachers.map((teacher) => (
              <Usuarios key={teacher.id} teacher={teacher} />
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "Rol" && (
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
                Permisos
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rol.map((rol) => (
              <Roles key={rol.id} rol={rol} />
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
