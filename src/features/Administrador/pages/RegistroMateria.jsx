import toast,{ Toaster } from "react-hot-toast";
import ManagementLayout from "@/components/administradorContenido";
import CartSidebar from "@/features/Administrador/components/pensum/CartSidebar";
import SemesterTable from "@/features/Administrador/components/pensum/SemesterTable";
import EstadoChip from "@/features/Administrador/components/pensum/EstadoChip";
import ProgramTable from "@/features/Administrador/components/pensum/ProgramTable";
import SemesterSuggestion from "@/features/Administrador/components/pensum/SemesterSuggestion";
import usePensumProgramacion from "@/features/Administrador/hooks/pensum/usePensumProgramacion";
import EstudiantesMateriasView from "@/features/Administrador/components/incripciones/estudianteMateria";
import { useState } from "react";

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
  } = usePensumProgramacion();
  const [activeTab, setActiveTab] = useState("Pensum");

  const tabs = [
    {
      key: "Pensum",
      label: "Registrar Materias",
    },
    {
      key: "estudiantes",
      label: "Estudiantes Programados",
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
        <div className=" mx-auto bg-white rounded-2xl shadow relative">
          <Toaster />
          {/* Carrito Flotante */}
          <CartSidebar
            cart={cart}
            showCart={showCart}
            setShowCart={setShowCart}
            totalMat={totalMat}
            handleRemoveFromCart={handleRemoveFromCart}
            limiteAlcanzado={limiteAlcanzado}
            handleRegistrarMaterias={handleRegistrarMaterias}
            loadingRegistrar={loadingRegistrar}
          />

          {/* Botón para mostrar carrito (siempre) */}
          {!showCart && (
            <button
              className="fixed top-4 right-4 z-50 bg-red-700 text-white px-4 py-2 rounded-xl shadow-md"
              onClick={() => setShowCart(true)}
            >
              Ver Programacion ({cart.length})
            </button>
          )}

          {/* CONTENIDO PRINCIPAL */}
          <h2 className="text-2xl font-bold mb-4 text-black text-center">
            Consulta de Pensum
          </h2>
          <form className="mb-6" onSubmit={handleSearch}>
            <input
              className="w-full border-2 border-black rounded-lg px-4 py-2 focus:outline-none"
              type="text"
              placeholder="Buscar por número de registro"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          {!materias.length ? (
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
              <SemesterSuggestion
                materiasPorSemestre={materiasPorSemestre}
                cart={cart}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Columna izquierda (impares) */}
                <div>
                  {semImpares.map((sem) => (
                    <SemesterTable
                      sem={sem}
                      materias={materiasPorSemestre[sem]}
                      accordion={accordion}
                      toggleAccordion={toggleAccordion}
                      todasAprobadas={todasAprobadas}
                    />
                  ))}
                </div>
                {/* Columna derecha (pares) */}
                <div>
                  {semPares.map((sem) => (
                    <SemesterTable
                      sem={sem}
                      materias={materiasPorSemestre[sem]}
                      accordion={accordion}
                      toggleAccordion={toggleAccordion}
                      todasAprobadas={todasAprobadas}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-red-800">
                  Materias programables (puede cursar) clasificadas por módulo:
                </h3>
                {materiasProgramables.length === 0 ? (
                  <div className="text-black">
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
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === "estudiantes" && (
        <EstudiantesMateriasView />
      )}
    </ManagementLayout>
  );
}
