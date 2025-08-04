import React, { useState } from "react";

// Datos simulados de materias y estudiantes
const materiasData = [
  {
    materia: {
      id: "332",
      nombre: "INTRODUCCIÓN A LA VIDA UNIVERSITARIA TEC",
      sigla: "TRBA-330",
      semestre: "1",
    },
    horarios: [
      {
        turno: "7:15-10:00",
        estudiantes: 143,
        grupos_sugeridos: 4,
        estudiantes_en_espera: 23,
        capacidad_por_grupo: 40,
        abierto: false,
      },
      {
        turno: "19:15-21:45",
        estudiantes: 74,
        grupos_sugeridos: 2,
        estudiantes_en_espera: 14,
        capacidad_por_grupo: 40,
        abierto: false,
      },
      {
        turno: "10:15-13:00",
        estudiantes: 31,
        grupos_sugeridos: 1,
        estudiantes_en_espera: 1,
        capacidad_por_grupo: 40,
        abierto: false,
      },
    ],
  },
  {
    materia: {
      id: "333",
      nombre: "FISICA I",
      sigla: "BFG-300",
      semestre: "1",
    },
    horarios: [
      {
        turno: "7:15-10:00",
        estudiantes: 150,
        grupos_sugeridos: 5,
        estudiantes_en_espera: 0,
        capacidad_por_grupo: 35,
        abierto: false,
      },
      {
        turno: "19:15-21:45",
        estudiantes: 73,
        grupos_sugeridos: 2,
        estudiantes_en_espera: 13,
        capacidad_por_grupo: 35,
        abierto: false,
      },
      {
        turno: "10:15-13:00",
        estudiantes: 20,
        grupos_sugeridos: 0,
        estudiantes_en_espera: 20,
        capacidad_por_grupo: 35,
        abierto: false,
      },
      {
        turno: "13:15-16:00",
        estudiantes: 1,
        grupos_sugeridos: 0,
        estudiantes_en_espera: 1,
        capacidad_por_grupo: 35,
        abierto: false,
      },
    ],
  },
];

// Datos simulados de estudiantes habilitados y sus preferencias
const estudiantesSimulados = [
  {
    id: 1,
    nombre: "Ana Pérez",
    ci: "1234567",
    materiaId: "332",
    preferencia: "7:15-10:00",
  },
  {
    id: 2,
    nombre: "Luis Gómez",
    ci: "9876543",
    materiaId: "332",
    preferencia: "19:15-21:45",
  },
  {
    id: 3,
    nombre: "Sara Rojas",
    ci: "8765432",
    materiaId: "332",
    preferencia: "7:15-10:00",
  },
  {
    id: 4,
    nombre: "Mario Vargas",
    ci: "7654321",
    materiaId: "333",
    preferencia: "7:15-10:00",
  },
  {
    id: 5,
    nombre: "Lucía López",
    ci: "7654123",
    materiaId: "333",
    preferencia: "19:15-21:45",
  },
  // ...agrega más para simular
];

const MODULOS = ["M0", "M1", "M2", "M3", "M4", "M5"];

export default function SimuladorAperturaMaterias() {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const [horariosApertura, setHorariosApertura] = useState({});
  const [acordeon, setAcordeon] = useState({});
  const [grupos, setGrupos] = useState([]);
  // ✅ Estados para módulos y seleccionados por cada horario
  const [modulosSeleccion, setModulosSeleccion] = useState({});
  const [estudiantesSeleccion, setEstudiantesSeleccion] = useState({});

  const materias = materiasData.map((m) => m.materia);
  const materiaData = materiasData.find(
    (m) => m.materia.id === materiaSeleccionada
  );
  const estudiantesMateria = estudiantesSimulados.filter(
    (est) => est.materiaId === materiaSeleccionada
  );

  function getEstudiantesPorTurno(turno) {
    return estudiantesMateria.filter((est) => est.preferencia === turno);
  }
  function eliminarGrupo(idx) {
    setGrupos((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleApertura(idx, value) {
    const key = `${materiaSeleccionada}-${idx}`;
    setHorariosApertura((prev) => ({ ...prev, [key]: value }));
    // Cuando abres, inicializa módulo y seleccionados si aún no están
    if (value) {
      const h = materiaData.horarios[idx];
      const estudiantesTurno = getEstudiantesPorTurno(h.turno);
      setModulosSeleccion((prev) => ({
        ...prev,
        [key]: prev[key] || "", // vacio si no había
      }));
      setEstudiantesSeleccion((prev) => ({
        ...prev,
        [key]: prev[key] || estudiantesTurno.map((e) => e.id), // todos por defecto si no había
      }));
    }
  }
  function toggleAcordeon(idx) {
    const key = `${materiaSeleccionada}-${idx}`;
    setAcordeon((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Generar grupo y agregar al panel derecho
  function handleCrearGrupo(turno, key, estudiantesAsignados, modulo) {
    setGrupos((prev) => [
      ...prev,
      {
        materia: materiaData.materia.nombre,
        sigla: materiaData.materia.sigla,
        turno,
        modulo,
        cantidad: estudiantesAsignados.length,
        estudiantes: estudiantesAsignados,
      },
    ]);
    // Opcional: limpiar selección para ese horario
    setModulosSeleccion((prev) => ({ ...prev, [key]: "" }));
    setEstudiantesSeleccion((prev) => ({ ...prev, [key]: [] }));
  }

  function getAnchoGrupo(cantidad) {
    if (cantidad > 30) return "w-full";
    if (cantidad > 15) return "w-2/3";
    return "w-1/3";
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <h2 className="text-4xl font-black mb-8 text-black flex items-center gap-3">
        <span className="block w-3 h-8 bg-red-700 rounded-sm" />
        Simulador de Apertura de Materias
      </h2>
      {/* Selector materia */}
      <div className="mb-10 flex items-center gap-6">
        <label className="font-bold text-lg text-black">Materia:</label>
        <select
          className="p-3 border-2 border-red-700 rounded-md shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black font-semibold"
          value={materiaSeleccionada}
          onChange={(e) => {
            setMateriaSeleccionada(e.target.value);
            setHorariosApertura({});
            setAcordeon({});
            setModulosSeleccion({});
            setEstudiantesSeleccion({});
          }}
        >
          <option value="">-- Selecciona materia --</option>
          {materias.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.nombre} ({mat.sigla})
            </option>
          ))}
        </select>
      </div>
      {materiaData && (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Panel horarios y apertura */}
          <div className="flex-1">
            <div className="mb-6 p-5 rounded-2xl border-l-8 border-red-700 bg-white shadow">
              <div className="text-2xl font-bold text-black">
                {materiaData.materia.nombre}
              </div>
              <div className="text-gray-800 mt-1">
                <b>Sigla:</b> {materiaData.materia.sigla}
                <span className="ml-5">
                  <b>Semestre:</b> {materiaData.materia.semestre}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-4 text-red-700 tracking-wider uppercase">
              Turnos y preferencias
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-red-700 rounded-xl bg-white shadow text-black">
                <thead className="bg-red-700 text-white font-semibold uppercase">
                  <tr>
                    <th className="p-2 border border-red-700">Turno</th>
                    <th className="p-2 border border-red-700"># Prefieren</th>
                    <th className="p-2 border border-red-700">Grupos</th>
                    <th className="p-2 border border-red-700">En espera</th>
                    <th className="p-2 border border-red-700">Abrir</th>
                    <th className="p-2 border border-red-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {materiaData.horarios.map((h, idx) => {
                    const key = `${materiaSeleccionada}-${idx}`;
                    const estudiantesTurno = getEstudiantesPorTurno(h.turno);

                    const moduloSel = modulosSeleccion[key] || "";
                    const seleccionados =
                      estudiantesSeleccion[key] ||
                      estudiantesTurno.map((e) => e.id);

                    return (
                      <React.Fragment key={h.turno}>
                        <tr className={acordeon[key] ? "bg-red-50" : ""}>
                          <td className="p-2 border border-red-700 font-extrabold">
                            {h.turno}
                          </td>
                          <td className="p-2 border border-red-700 text-center">
                            {estudiantesTurno.length}
                          </td>
                          <td className="p-2 border border-red-700 text-center">
                            {h.grupos_sugeridos}
                          </td>
                          <td className="p-2 border border-red-700 text-center">
                            {h.estudiantes_en_espera}
                          </td>
                          <td className="p-2 border border-red-700 text-center">
                            <input
                              type="checkbox"
                              className="accent-red-700 h-5 w-5"
                              checked={!!horariosApertura[key]}
                              onChange={(e) =>
                                handleApertura(idx, e.target.checked)
                              }
                            />
                          </td>
                          <td className="p-2 border border-red-700 text-center">
                            <button
                              className="px-2 py-1 rounded bg-white border-2 border-red-700 text-red-700 font-bold hover:bg-red-700 hover:text-white transition"
                              onClick={() => toggleAcordeon(idx)}
                            >
                              {acordeon[key] ? "Ocultar" : "Configurar grupo"}
                            </button>
                          </td>
                        </tr>
                        {acordeon[key] && horariosApertura[key] && (
                          <tr>
                            <td
                              colSpan={6}
                              className="p-4 border-t-0 bg-red-50 border-b-2 border-red-700"
                            >
                              {/* Configuración de grupo */}
                              <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                  <div className="mb-2 font-bold text-black">
                                    Asignar módulo:
                                  </div>
                                  <div className="flex gap-3 mb-4">
                                    {MODULOS.map((mod) => (
                                      <button
                                        key={mod}
                                        className={`px-4 py-2 rounded font-bold border-2 ${
                                          moduloSel === mod
                                            ? "bg-red-700 text-white border-red-700"
                                            : "border-red-300 bg-white text-red-700 hover:bg-red-100"
                                        }`}
                                        onClick={() =>
                                          setModulosSeleccion((prev) => ({
                                            ...prev,
                                            [key]: mod,
                                          }))
                                        }
                                      >
                                        {mod}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="mb-2 font-bold text-black">
                                    Selecciona estudiantes:
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto bg-white p-2 rounded border border-red-200">
                                    {estudiantesTurno.map((est) => (
                                      <label
                                        key={est.id}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="checkbox"
                                          className="accent-red-700"
                                          checked={seleccionados.includes(
                                            est.id
                                          )}
                                          onChange={(e) => {
                                            setEstudiantesSeleccion((prev) => ({
                                              ...prev,
                                              [key]: e.target.checked
                                                ? [...seleccionados, est.id]
                                                : seleccionados.filter(
                                                    (id) => id !== est.id
                                                  ),
                                            }));
                                          }}
                                        />
                                        <span>
                                          {est.nombre}{" "}
                                          <span className="text-xs text-gray-600">
                                            (CI: {est.ci})
                                          </span>
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                  <button
                                    disabled={
                                      !moduloSel || seleccionados.length === 0
                                    }
                                    className={`mt-4 px-5 py-2 font-bold rounded ${
                                      !moduloSel || seleccionados.length === 0
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-red-700 text-white hover:bg-black"
                                    }`}
                                    onClick={() =>
                                      handleCrearGrupo(
                                        h.turno,
                                        key,
                                        estudiantesTurno.filter((e) =>
                                          seleccionados.includes(e.id)
                                        ),
                                        moduloSel
                                      )
                                    }
                                  >
                                    Generar grupo ({seleccionados.length})
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Panel lateral: grupos generados */}
          <div className="md:w-96">
            <h3 className="text-lg font-bold mb-3 text-red-700 uppercase tracking-wide">
              Grupos generados
            </h3>
            <div className="flex flex-col gap-5">
              {grupos.length === 0 && (
                <div className="text-gray-400 bg-white border-2 border-red-700 rounded-xl p-6 text-center">
                  Aún no hay grupos generados.
                </div>
              )}
              {grupos.map((g, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl shadow-lg border-2 border-red-700 p-4 transition-all duration-300 ${getAnchoGrupo(
                    g.cantidad
                  )} bg-white flex flex-col gap-2`}
                  style={{
                    minWidth: "180px",
                    maxWidth: "100%",
                  }}
                >
                  <button
                    onClick={() => eliminarGrupo(i)}
                    className="absolute top-2 right-2 text-white hover:text-black text-xl font-bold rounded-full px-2 transition"
                    title="Eliminar grupo"
                  >
                    ×
                  </button>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-black">
                      {g.turno}
                    </span>
                    <span className="text-sm font-bold px-2 py-1 rounded bg-red-700 text-white">
                      {g.modulo}
                    </span>
                  </div>
                  <div className="text-black text-xs mb-2">
                    {g.materia} ({g.sigla})
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-700">
                      {g.cantidad} estudiante{g.cantidad !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <ul className="pl-5 mt-1 text-xs text-gray-700 max-h-16 overflow-y-auto">
                    {g.estudiantes.map((est) => (
                      <li key={est.id}>
                        {est.nombre} ({est.ci})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
