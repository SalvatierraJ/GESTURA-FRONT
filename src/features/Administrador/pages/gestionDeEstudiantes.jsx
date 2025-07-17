import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import ManagementLayout from "@/components/administradorContenido";
import FechaDefensa from "@/features/Administrador/components/modal-fechaDefensa";
import RegistrarEstudiante from "@/features/Administrador/components/modal-registroEstudiante";
import ImportarEstudiantesExcel from "@/features/Administrador/components/importarEstudiante";
import { useEstudiantesStore } from "@/store/estudiantes.store";
import InputBuscar from "@/components/searchInput";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";

const normalizar = (str) =>
  (str || "").toLowerCase().replace(/\s+/g, " ").trim();

const getUltimaDefensaPorTipo = (defensas, tipo) =>
  [...(defensas || [])]
    .filter(
      (d) =>
        d.nombre_tipo_defensa &&
        normalizar(d.nombre_tipo_defensa) === normalizar(tipo)
    )
    .sort((a, b) => new Date(b.fecha_defensa) - new Date(a.fecha_defensa))[0] ||
  null;

const getDefensaEstado = (defensa) => defensa?.estado || "SIN_ASIGNAR";

const DefensaCellTipo = ({
  tipo,
  defensas = [],
  estudianteId,
  onAsignarDefensa,
  cargarEstudiantes,
  page,
  pageSize,
}) => {
  const otraTipo =
    tipo === "Examen de grado Interna"
      ? "Examen de grado Externa"
      : "Examen de grado Interna";
  const defensa = getUltimaDefensaPorTipo(defensas, tipo);
  const defensaOtra = getUltimaDefensaPorTipo(defensas, otraTipo);
  const disabled =
    tipo === "Examen de grado Externa" &&
    getDefensaEstado(defensaOtra) !== "APROBADO";

  const puedeCrearNueva = !defensa || getDefensaEstado(defensa) === "REPROBADO";
  const pendiente = getDefensaEstado(defensa) === "PENDIENTE";
  const asignado = getDefensaEstado(defensa) === "ASIGNADO";
  const aprobado = getDefensaEstado(defensa) === "APROBADO";

  if (!defensa || puedeCrearNueva) {
    return (
      <FechaDefensa
        estudianteIds={[estudianteId]}
        tipo={tipo}
        triggerLabel={
          puedeCrearNueva
            ? `Asignar ${tipo[0].toUpperCase() + tipo.slice(1)}`
            : `Nueva ${tipo[0].toUpperCase() + tipo.slice(1)}`
        }
        triggerIcon="pi pi-calendar-plus"
        onSubmit={onAsignarDefensa}
        disabled={disabled}
        onSuccess={() => {
          cargarEstudiantes(page, pageSize);
        }}
      />
    );
  }

  if (asignado || pendiente) {
    return (
      <span className="flex flex-col gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            asignado
              ? "text-green-800 bg-green-200"
              : "text-yellow-800 bg-yellow-200"
          }`}
        >
          {`${tipo[0].toUpperCase() + tipo.slice(1)}: ${getDefensaEstado(
            defensa
          )}`}
        </span>
        {pendiente && (
          <FechaDefensa
            estudianteIds={[estudianteId]}
            tipo={tipo}
            triggerLabel="Editar Fecha"
            triggerIcon="pi pi-calendar-plus"
            onSubmit={onAsignarDefensa}
            disabled={disabled}
            onSuccess={() => {
              cargarEstudiantes(page, pageSize);
            }}
          />
        )}
      </span>
    );
  }

  if (aprobado) {
    return (
      <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">
        {`${tipo[0].toUpperCase() + tipo.slice(1)}: APROBADA`}
      </span>
    );
  }

  if (getDefensaEstado(defensa) === "REPROBADO") {
    return (
      <FechaDefensa
        estudianteIds={[estudianteId]}
        tipo={tipo}
        triggerLabel="Nueva Defensa"
        triggerIcon="pi pi-calendar-plus"
        onSubmit={onAsignarDefensa}
        disabled={disabled}
        onSuccess={() => {
          cargarEstudiantes(page, pageSize);
        }}
      />
    );
  }

  return <span>-</span>;
};

const StudentRow = ({
  student,
  selected,
  onToggle,
  setModalVisible,
  setEstudianteAEditar,
  cargarEstudiantes,
  page,
  pageSize,
}) => {
  const checked = selected.includes(student.id_estudiante);
  return (
    <tr className="border-b last:border-none hover:bg-gray-50">
      <td className="px-4 py-3">
        <Checkbox
          inputId={`chk-${student.id_estudiante}`}
          checked={checked}
          onChange={() => onToggle(student.id_estudiante)}
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.id_estudiante}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.nombre}, {student.apellido1}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.correo}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.telefono}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>
      <td className="px-4 py-3">
        <DefensaCellTipo
          tipo="Examen de grado Interna"
          defensas={student.defensas}
          estudianteId={student.id_estudiante}
          cargarEstudiantes={cargarEstudiantes}
          page={page}
          pageSize={pageSize}
        />
      </td>
      <td className="px-4 py-3">
        <DefensaCellTipo
          tipo="Examen de grado Externa"
          defensas={student.defensas}
          estudianteId={student.id_estudiante}
          cargarEstudiantes={cargarEstudiantes}
          page={page}
          pageSize={pageSize}
        />
      </td>

      <td className="px-4 py-3 text-center space-x-2">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            setModalVisible(true);
            setEstudianteAEditar(student);
          }}
        >
          <i className="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("ExamendeGrado");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { Estudiantes, cargarEstudiantes, loading, total } =
    useEstudiantesStore();
  useEffect(() => {
    if (activeTab === "ExamendeGrado") cargarEstudiantes(page, pageSize);
  }, [page, pageSize, cargarEstudiantes]);
  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [activeTab]);
  const filteredEstudiante = Estudiantes.filter((c) =>
    (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [estudianteAEditar, setEstudianteAEditar] = useState(null);

  const tabs = [
    { key: "ExamendeGrado", label: "Examen de Grado" },
    {
      key: "ProyectodeGrado",
      label: "Proyecto de Grado",
    },
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
        onClick={() => {
          setModalVisible(true);
          setEstudianteAEditar(null);
        }}
        style={{ backgroundColor: "#e11d1d", hover: "#b91c1c", margin: "10px" }}
      >
        Nuevo Estudiante
      </Button>,
      <ImportarEstudiantesExcel
        onImport={(estudiantesImportados) => {
          // Aquí puedes hacer setStudents([...students, ...estudiantesImportados]);
          // O llamar a tu backend para registrar en lote, etc.
          console.log("Estudiantes importados:", estudiantesImportados);
          // Si quieres añadirlos a tu lista local, tendrás que tener students como useState
        }}
      />,
      <FechaDefensa
        estudianteIds={selected}
        triggerLabel="Asignar Defensa"
        onSubmit={(data) => {
          console.log(data);
        }}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombres Completo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrera
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defensa Interna
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defensa Externa
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstudiante.map((student) => (
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
            onSuccess={() => {
              cargarEstudiantes(page, pageSize);
            }}
          />
        </>
      )}
    </ManagementLayout>
  );
};

export default MainContent;
