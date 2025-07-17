import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import ManagementLayout from "@/components/administradorContenido";
import ModalAsignarJurados from "@/features/Administrador/components/modal-asignarJurado";
import { useDefensasStore } from "@/store/defensas.store";
import AddAula from "@/features/Administrador/components/agregarAula";
import AddNota from "@/features/Administrador/components/agregarNota";
import { Paginator } from "primereact/paginator";
import InputBuscar from "@/components/searchInput";

const DefenseRow = ({ student, selected, onToggle }) => {
  const tieneJurados = student.jurados && student.jurados.length > 0;
  const checked = !tieneJurados && selected.includes(student.id_defensa);

  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3">
        <Checkbox
          inputId={`chk-${student.id_defensa}`}
          checked={checked}
          onChange={() => onToggle(student.id_defensa)}
          disabled={tieneJurados}
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.id_defensa}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.estudiante}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.nombre_tipo_defensa}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.fecha}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.hora}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.aula ? student.aula : "Sin Aula"}
        <AddAula id_defensa={student.id_defensa} notaActual={student.nota} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {tieneJurados ? (
          student.jurados.map((j) => j.nombre).join(", ")
        ) : (
          <span className="italic text-gray-400">Sin jurados</span>
        )}
      </td>
      <td className="px-4 py-3">
        {student.estado === "ASIGNADO" && (
          <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
            {student.estado}
          </span>
        )}
        {student.status === "PENDIENTE" && (
          <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">
            {student.estado}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.nota ? student.nota : "Sin Nota"}
        <AddNota id_defensa={student.id_defensa} notaActual={student.nota} />
      </td>
    </tr>
  );
};

const MainContent = () => {
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("Interna");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    defensasInterna,
    defensasExternas,
    totalPages,
    loading,
    error,
    cargarDefensasInterna,
    cargarDefensasExternas,
  } = useDefensasStore();
  useEffect(() => {
    if (activeTab === "Interna")
      cargarDefensasInterna(page, pageSize, "Examen de grado Interna");
    else if (activeTab === "Externa")
      cargarDefensasExternas(page, pageSize, "Examen de grado Externa");
  }, [page, pageSize, cargarDefensasInterna, cargarDefensasExternas]);
  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);
  const filteredDefensa = defensasInterna.filter((c) =>
    (c.estudiante || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDefensaExterna = defensasExternas.filter((c) =>
    (c.estudiante || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };
  const toggleSelect = (id_defensa) => {
    setSelected((prev) =>
      prev.includes(id_defensa)
        ? prev.filter((x) => x !== id_defensa)
        : [...prev, id_defensa]
    );
  };

  const actions = [
    <InputBuscar
      key="search"
      value={searchTerm}
      onChange={setSearchTerm}
      placeholder="Buscar Estudiante.."
    />,
    <ModalAsignarJurados
      defensasIds={selected}
      triggerLabel="Asignar Jurados"
      onSubmit={(data) => {
        console.log(data);
      }}
      onSuccess={() => {
        if (activeTab === "Interna") cargarDefensasInterna(page, pageSize);
        else if (activeTab === "Externa")
          cargarDefensasExternas(page, pageSize, "Examen de grado Externa");
      }}
    />,
  ];
  const tabs = [
    {
      key: "Interna",
      label: "Examen de Grado Interna",
    },
    {
      key: "Externa",
      label: "Examen de Grado Externa",
    },
  ];

  return (
    <ManagementLayout
      title="Defensas Programadas"
      actions={actions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Interna" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Defensa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Defensa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora de Defensa
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDefensa.map((student) => (
                <DefenseRow
                  key={student.id_defensa}
                  student={student}
                  selected={selected}
                  onToggle={toggleSelect}
                  AddAula={AddAula}
                />
              ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={totalPages}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>
        </>
      )}
      {activeTab === "Externa" && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Defensa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Defensa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora de Defensa
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDefensaExterna.map((student) => (
                <DefenseRow
                  key={student.id_defensa}
                  student={student}
                  selected={selected}
                  onToggle={toggleSelect}
                  AddAula={AddAula}
                />
              ))}
            </tbody>
          </table>
          <div className="w-full flex justify-center mt-4">
            <Paginator
              first={(page - 1) * pageSize}
              rows={pageSize}
              totalRecords={totalPages}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            />
          </div>
        </>
      )}
    </ManagementLayout>
  );
};

export default MainContent;
