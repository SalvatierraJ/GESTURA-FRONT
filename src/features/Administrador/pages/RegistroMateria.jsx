import { Toaster } from "react-hot-toast";
import ManagementLayout from "@/components/administradorContenido";
import CartSidebar from "@/features/Administrador/components/pensum/CartSidebar";
import SemesterTable from "@/features/Administrador/components/pensum/SemesterTable";
import EstadoChip from "@/features/Administrador/components/pensum/EstadoChip";
import ProgramTable from "@/features/Administrador/components/pensum/ProgramTable";
import SemesterSuggestion from "@/features/Administrador/components/pensum/SemesterSuggestion";
import usePensumProgramacion from "@/features/Administrador/hooks/pensum/usePensumProgramacion";
import EstudiantesMateriasView from "@/features/Administrador/components/incripciones/estudianteMateria";
import RightSidebar from "@/features/Administrador/components/pensum/RightSidebar";
import { useEffect, useMemo, useState, memo, useRef } from "react";
import { useOutletContext } from "react-router-dom";

// Componente separado para el sidebar para evitar recreaciones
const SidebarContent = memo(({ 
  materiasPorSemestre, 
  cart, 
  totalMat, 
  handleRemoveFromCart, 
  limiteAlcanzado, 
  handleRegistrarMaterias, 
  loadingRegistrar 
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
));

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
  } = usePensumProgramacion();
  const { setRightSidebar, setSuggestions, setCartCount } = useOutletContext();

  const sugerencias = useMemo(() => {
    // Si no hay materias cargadas, mostrar sugerencias por defecto
    if (Object.keys(materiasPorSemestre).length === 0) {
      return [
        {
          icon: "fas fa-search",
          title: "Buscar estudiante",
          count: 0,
        },
        {
          icon: "fas fa-lightbulb",
          title: "Sugerencias disponibles",
          count: 0,
        }
      ];
    }
    
    return Object.entries(materiasPorSemestre)
      .filter(([_, materiasSemestre]) => {
        const pendientes = materiasSemestre.filter(
          (mat) =>
            mat.estado !== "aprobada" &&
            !cart.some((c) => c.siglas === mat.siglas)
        );
        return pendientes.length === 1 || pendientes.length === 2;
      })
      .map(([sem]) => ({
        icon: "fas fa-lightbulb",
        title: `Sugerencia para semestre ${sem}`,
        count: materiasPorSemestre[sem].filter(
          (mat) =>
            mat.estado !== "aprobada" &&
            !cart.some((c) => c.siglas === mat.siglas)
        ).length,
      }));
  }, [materiasPorSemestre, cart]);

  const [activeTab, setActiveTab] = useState("Pensum");
  
  // Usar useRef para rastrear el estado anterior y evitar actualizaciones innecesarias
  const prevStateRef = useRef(null);
  
  // Efecto unificado que maneja tanto el render inicial como las actualizaciones
  useEffect(() => {
    const currentState = {
      cartLength: cart.length,
      totalMat,
      loadingRegistrar,
      sugerenciasLength: sugerencias.length,
      hasMaterias: Object.keys(materiasPorSemestre).length > 0,
    };
    
    // Ejecutar en el primer render o cuando el estado cambie
    if (prevStateRef.current === null || JSON.stringify(prevStateRef.current) !== JSON.stringify(currentState)) {
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
  }, [cart.length, totalMat, loadingRegistrar, sugerencias.length, Object.keys(materiasPorSemestre).length]);
  
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
    </ManagementLayout>
  );
}
