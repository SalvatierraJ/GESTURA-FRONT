import { Toaster } from "react-hot-toast";
import ManagementLayout from "@/components/administradorContenido";
import CartSidebar from "@/features/Administrador/components/pensum/CartSidebar";
import SemesterTable from "@/features/Administrador/components/pensum/SemesterTable";
import ProgramTable from "@/features/Administrador/components/pensum/ProgramTable";
import SemesterSuggestion from "@/features/Administrador/components/pensum/SemesterSuggestion";
import usePensumProgramacion from "@/features/Administrador/hooks/pensum/usePensumProgramacion";
import EstudiantesMateriasView from "@/features/Administrador/components/incripciones/estudianteMateria";
import { useEffect, useState, memo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { usePensumStore } from "../../../store/materia.store";
import { Dropdown } from "primereact/dropdown";
import ModalEditPrereqEquiv from "../components/pensum/modalPreReq";
import { Button } from "primereact/button";
import Simulador from "@/features/Administrador/components/pensum/SimuladorAperturaMaterias";
const SidebarContent = memo(
  ({
    materiasPorSemestre,
    cart,
    totalMat,
    handleRemoveFromCart,
    limiteAlcanzado,
    handleRegistrarMaterias,
    loadingRegistrar,
  }) => (
    <div className="bg-white border border-red-300 shadow-xl rounded-2xl p-4">
      <p className="mb-3 text-gray-700">
        <SemesterSuggestion
          materiasPorSemestre={materiasPorSemestre}
          cart={cart}
        />
      </p>
      <CartSidebar
        cart={cart}
        totalMat={totalMat}
        handleRemoveFromCart={handleRemoveFromCart}
        limiteAlcanzado={limiteAlcanzado}
        handleRegistrarMaterias={handleRegistrarMaterias}
        loadingRegistrar={loadingRegistrar}
      />
    </div>
  )
);

export default function PensumEstudiante() {
  const {
    busqueda,
    setBusqueda,
    handleSearch,
    materias,
    materiasPorSemestre,
    semImpares,
    semPares,
    accordion,
    setAccordion,
    toggleAccordion,
    todasAprobadas,
    contarAprobadas,
    cart,
    showCart,
    setShowCart,
    totalMat,
    limiteAlcanzado,
    handleRemoveFromCart,
    isInCart,
    handleAddToCart,
    materiasProgramables,
    HORARIOS_FIJOS,
    nombreCompleto,
    pensum,
    handleRegistrarMaterias,
    loadingRegistrar,
    MODULOS,

    modal,
    setModal,
    handleEditPrereq,
    handleEditEquiv,
    handleSave,
    selected,
    setSelected,
    handleBuscar,
    options,
    sugerencias,
    materiasHash,
    ajusteMateria,
    materiasPorSemestreAjuste,
    semImparesAjuste,
    semParesAjuste,
    loadingBusqueda
  } = usePensumProgramacion();
  const { setRightSidebar, setSuggestions, setCartCount } = useOutletContext();
  const {
    loadingPensum,

    materiasIdNombrePensum,
  } = usePensumStore();

  const [activeTab, setActiveTab] = useState("Pensum");

  const prevStateRef = useRef(null);
  useEffect(() => {
    const currentState = {
      cartLength: cart.length,
      totalMat,
      loadingRegistrar,
      sugerenciasLength: sugerencias.length,
      materiasHash,
    };

    if (
      prevStateRef.current === null ||
      JSON.stringify(prevStateRef.current) !== JSON.stringify(currentState)
    ) {
      prevStateRef.current = currentState;

      const content = (
        <SidebarContent
          materiasPorSemestre={materiasPorSemestre}
          cart={cart}
          totalMat={totalMat}
          handleRemoveFromCart={handleRemoveFromCart}
          limiteAlcanzado={limiteAlcanzado}
          handleRegistrarMaterias={handleRegistrarMaterias}
          loadingRegistrar={loadingRegistrar}
        />
      );

      setRightSidebar(content);
      setSuggestions(sugerencias);
      setCartCount(cart.length);
    }

    return () => {
      setRightSidebar(null);
      setSuggestions(null);
      setCartCount(0);
    };
  }, [
    cart.length,
    totalMat,
    loadingRegistrar,
    sugerencias.length,
    materiasHash,
  ]);

  const tabs = [
    {
      key: "Pensum",
      label: "Registrar Materias",
    },
    {
      key: "estudiantes",
      label: "Estudiantes Programados",
    },
     {
      key: "simulador",
      label: "Simulador de Apertura de Materias",
    },
    {
      key: "ajustes",
      label: "Ajuste de Pensum",
    },
  ];

  return (
    <ManagementLayout
      title="Programar Materias"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "Pensum" && (
        <div className="bg-white rounded-2xl shadow max-w-7xl mx-auto relative p-6">
          <Toaster />

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              Consulta de Pensum
            </h2>
            <form className="mb-6 w-full max-w-md" onSubmit={handleSearch}>
              <input
                className="w-full border-2 border-black rounded-lg px-4 py-2 focus:outline-none"
                type="text"
                placeholder="Buscar por número de registro"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </form>
            {loadingBusqueda ? (
              <div className="flex justify-center items-center my-8">
                <i className="pi pi-spin pi-spinner text-4xl text-red-700" />
                <span className="ml-4 text-black">Buscando estudiante...</span>
              </div>
            ) : !materias.length ? (
              <div className="text-center text-black">
                Ingrese el número de registro del estudiante y presione Enter.
              </div>
            ) : (
              <>
                <div className="font-bold text-xl mb-2 text-black text-center">
                  {nombreCompleto && (
                    <span className="block">{nombreCompleto}</span>
                  )}
                  {pensum?.[0]?.carrera} — Pensum {pensum?.[0]?.pensum}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full max-w-6xl">
                  {/* Columna izquierda (impares) */}
                  <div>
                    {semImpares.map((sem) => (
                      <SemesterTable
                        key={sem}
                        sem={sem}
                        materias={materiasPorSemestre[sem]}
                        accordion={accordion}
                        toggleAccordion={toggleAccordion}
                        todasAprobadas={todasAprobadas}
                        contarAprobadas={contarAprobadas}
                      />
                    ))}
                  </div>
                  {/* Columna derecha (pares) */}
                  <div>
                    {semPares.map((sem) => (
                      <SemesterTable
                        key={sem}
                        sem={sem}
                        materias={materiasPorSemestre[sem]}
                        accordion={accordion}
                        toggleAccordion={toggleAccordion}
                        todasAprobadas={todasAprobadas}
                        contarAprobadas={contarAprobadas}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-8 w-full max-w-6xl">
                  <h3 className="text-xl font-bold mb-3 text-red-800 text-center">
                    Materias programables (puede cursar) clasificadas por
                    módulo:
                  </h3>
                  {materiasProgramables.length === 0 ? (
                    <div className="text-black text-center">
                      No hay materias programables actualmente.
                    </div>
                  ) : (
                    <ProgramTable
                      materiasProgramables={materiasProgramables}
                      HORARIOS_FIJOS={HORARIOS_FIJOS}
                      cart={cart}
                      isInCart={isInCart}
                      handleAddToCart={handleAddToCart}
                      limiteAlcanzado={limiteAlcanzado}
                      accordion={accordion}
                      setAccordion={setAccordion}
                      MODULOS={MODULOS}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {activeTab === "estudiantes" && <EstudiantesMateriasView />}
      {activeTab === "ajustes" && (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              Consulta de Pensum
            </h2>
            <div className="flex gap-2 items-center">
              <Dropdown
                value={selected}
                options={options}
                onChange={(e) => setSelected(e.value)}
                placeholder="Seleccione carrera y pensum"
                className="w-80"
                filter
              />
              <Button
                label="Buscar"
                icon="pi pi-search"
                onClick={handleBuscar}
                disabled={!selected || loadingPensum}
              />
            </div>

            {loadingPensum && (
              <div className="flex justify-center items-center my-8">
                <i className="pi pi-spin pi-spinner text-4xl text-red-700" />
                <span className="ml-4 text-black">Cargando pensum...</span>
              </div>
            )}

            {ajusteMateria.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full max-w-6xl mx-auto mt-6">
                <div>
                  {semImparesAjuste.map((sem) => (
                    <SemesterTable
                      key={sem}
                      sem={sem}
                      materias={materiasPorSemestreAjuste[sem]}
                      accordion={accordion}
                      toggleAccordion={toggleAccordion}
                      todasAprobadas={todasAprobadas}
                      contarAprobadas={contarAprobadas}
                      editable={true}
                      onEditPrereq={handleEditPrereq}
                      onEditEquiv={handleEditEquiv}
                    />
                  ))}
                </div>
                <div>
                  {semParesAjuste.map((sem) => (
                    <SemesterTable
                      key={sem}
                      sem={sem}
                      materias={materiasPorSemestreAjuste[sem]}
                      accordion={accordion}
                      toggleAccordion={toggleAccordion}
                      todasAprobadas={todasAprobadas}
                      contarAprobadas={contarAprobadas}
                      editable={true}
                      onEditPrereq={handleEditPrereq}
                      onEditEquiv={handleEditEquiv}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loadingPensum && ajusteMateria.length === 0 && (
              <div className="text-center text-black mt-6">
                Selecciona una carrera y un pensum, luego haz clic en "Buscar".
              </div>
            )}
          </div>
          <ModalEditPrereqEquiv
            visible={modal.open}
            onHide={() => setModal((prev) => ({ ...prev, open: false }))}
            modo={modal.modo}
            materiaActual={modal.materia || { id: null }}
            materiasIdNombrePensum={materiasIdNombrePensum}
            initialValues={modal.initialValues}
            onSave={handleSave}
          />
        </>
      )}

      {activeTab === "simulador" && (
        
        <Simulador
          optins={options}
          MODULOS={MODULOS}
        />

      )}
    </ManagementLayout>
  );
}
