import SelectorMateria from "./SelectorMateria";
import TablaHorarios from "./TablaHorarios";
import PanelGruposGenerados from "./PanelGruposGenerados";
import ModalNotificarEstudiantes from "./ModalNotificarEstudiantes";
import useAperturaMateriasSimulador from "../../hooks/pensum/useAperturaMateriasSimulador";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toaster } from "react-hot-toast"; 

const MODULOS = ["M0", "M1", "M2", "M3", "M4", "M5"];

export default function SimuladorAperturaMaterias({ optins }) {
  const {
    loadingMateriasRecomendadas,
    selected,
    setSelected,
    handleBuscarMateriasRecomendadas,
    materiaSeleccionada,
    setMateriaSeleccionada,
    horariosApertura,
    acordeon,
    grupos,
    modulosSeleccion,
    estudiantesSeleccion,
    cantidadGrupo,
    materias,
    materiaData,
    getEstudiantesPorTurno,
    handleApertura,
    toggleAcordeon,
    handleCrearGrupo,
    eliminarGrupo,
    getAnchoGrupo,
    setModulosSeleccion,
    setEstudiantesSeleccion,
    setCantidadGrupo,
    // Funciones de notificación
    modalNotificacion,
    handleNotificarEstudiantes,
    cerrarModalNotificacion,
  } = useAperturaMateriasSimulador();

  return (
    <>
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-black text-center">
        Seleccione el Pensum a Simular
      </h2>
      <div className="flex gap-2 items-center">
        <Dropdown
          value={selected}
          options={optins}
          onChange={(e) => setSelected(e.value)}
          placeholder="Seleccione carrera y pensum"
          className="w-80"
          filter
        />
        <Button
          label="Buscar"
          icon="pi pi-search"
          onClick={handleBuscarMateriasRecomendadas}
          disabled={!selected || loadingMateriasRecomendadas}
        />
        {loadingMateriasRecomendadas && (
          <span className="ml-4">
            <ProgressSpinner
              style={{ width: "32px", height: "32px" }}
              strokeWidth="4"
              fill="var(--surface-ground)"
              animationDuration=".7s"
            />
          </span>
        )}
      </div>

      {loadingMateriasRecomendadas ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ProgressSpinner style={{ width: "48px", height: "48px" }} strokeWidth="6" />
          <div className="text-lg text-gray-700 mt-6 font-semibold">Cargando materias...</div>
        </div>
      ) : (
        <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
          <h2 className="text-4xl font-black mb-8 text-black flex items-center gap-3">
            <span className="block w-3 h-8 bg-red-700 rounded-sm" />
            Simulador de Apertura de Materias
          </h2>

        
          <SelectorMateria
            materias={materias}
            materiaSeleccionada={materiaSeleccionada}
            setMateriaSeleccionada={setMateriaSeleccionada}
          />
          {materiaData && (
            <div className="flex flex-col lg:flex-row gap-10">
              <TablaHorarios
                materiaData={materiaData}
                materiaSeleccionada={materiaSeleccionada}
                acordeon={acordeon}
                horariosApertura={horariosApertura}
                modulosSeleccion={modulosSeleccion}
                estudiantesSeleccion={estudiantesSeleccion}
                cantidadGrupo={cantidadGrupo}
                getEstudiantesPorTurno={getEstudiantesPorTurno}
                handleApertura={handleApertura}
                toggleAcordeon={toggleAcordeon}
                setModulosSeleccion={setModulosSeleccion}
                setCantidadGrupo={setCantidadGrupo}
                setEstudiantesSeleccion={setEstudiantesSeleccion}
                handleCrearGrupo={handleCrearGrupo}
                handleNotificarEstudiantes={handleNotificarEstudiantes}
                MODULOS={MODULOS}
              />
              <PanelGruposGenerados
                grupos={grupos}
                eliminarGrupo={eliminarGrupo}
                getAnchoGrupo={getAnchoGrupo}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal de notificación */}
      <ModalNotificarEstudiantes
        visible={modalNotificacion.visible}
        onHide={cerrarModalNotificacion}
        estudiantes={modalNotificacion.estudiantes}
        materia={materiaData?.materia?.nombre || ""}
        turno={modalNotificacion.turno}
        semestreMateria={parseInt(materiaData?.materia?.semestre || "1")}
        onSuccess={() => {
          // Opcional: agregar lógica adicional después del envío exitoso
        }}
      />
    </>
  );
}
