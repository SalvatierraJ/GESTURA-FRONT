import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const AREAS = [
  "Redes",
  "Ingeniería de Software",
  "Bases de Datos",
  "Inteligencia Artificial",
  "Seguridad Informática",
];

const CASOS = [
  "Sistema de Inventario",
  "Gestión de Laboratorio",
  "Plataforma E-learning",
  "Sistema de Reservas",
  "Control de Asistencias",
];

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function DefensaSorteoSimulado() {
  // Estados para animación
  const [enSorteo, setEnSorteo] = useState(false);
  const [areaActual, setAreaActual] = useState("");
  const [casoActual, setCasoActual] = useState("");
  const [areaSorteada, setAreaSorteada] = useState(null);
  const [casoSorteado, setCasoSorteado] = useState(null);
  const [sortearCaso, setSortearCaso] = useState(true); // Cambia a false si solo es área

  // Simular el sorteo tipo "ruleta"
  const animInterval = useRef(null);

  const iniciarSorteo = () => {
    setEnSorteo(true);
    setAreaSorteada(null);
    setCasoSorteado(null);
    let t = 0;
    animInterval.current = setInterval(() => {
      setAreaActual(getRandom(AREAS));
      setCasoActual(sortearCaso ? getRandom(CASOS) : "");
      t += 1;
      if (t > 30) { // animar por ~1.5 segundos
        clearInterval(animInterval.current);
        const areaResult = getRandom(AREAS);
        setAreaActual(areaResult);
        setAreaSorteada(areaResult);
        if (sortearCaso) {
          const casoResult = getRandom(CASOS);
          setCasoActual(casoResult);
          setCasoSorteado(casoResult);
        }
        setEnSorteo(false);
      }
    }, 50);
  };

  useEffect(() => {
    return () => clearInterval(animInterval.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-50 px-4">
      <Card className="max-w-lg w-full shadow-lg border border-gray-200 rounded-2xl bg-white">
        <div className="flex flex-col items-center py-10">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Sorteo de Defensa
          </h1>
          <p className="mb-6 text-gray-600 text-center">
            Al presionar "Iniciar Sorteo", podrás ver en tiempo real el área y caso de estudio que te tocaron. <br />
            {sortearCaso ? "Ambos serán sorteados." : "Solo el área será sorteada."}
          </p>
          <div className="w-full flex flex-col items-center">
            {/* Área animada */}
            <div className="mb-5 w-full">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 font-medium mb-1 tracking-wide">Área Asignada</span>
                <div
                  className={`transition-all duration-200 ease-in-out text-xl md:text-2xl font-bold py-2 px-6 rounded-xl border-2 ${
                    areaSorteada
                      ? "bg-green-100 border-green-500 text-green-700 shadow"
                      : "bg-white border-gray-400 text-gray-800"
                  } animate-pulse`}
                  style={{ minWidth: 200, minHeight: 48, textAlign: "center" }}
                >
                  {areaSorteada ? areaSorteada : enSorteo ? areaActual : "-"}
                </div>
              </div>
            </div>
            {/* Caso animado */}
            {sortearCaso && (
              <div className="mb-5 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 font-medium mb-1 tracking-wide">Caso de Estudio Asignado</span>
                  <div
                    className={`transition-all duration-200 ease-in-out text-xl md:text-2xl font-bold py-2 px-6 rounded-xl border-2 ${
                      casoSorteado
                        ? "bg-green-100 border-green-500 text-green-700 shadow"
                        : "bg-white border-gray-400 text-gray-800"
                    } animate-pulse`}
                    style={{ minWidth: 200, minHeight: 48, textAlign: "center" }}
                  >
                    {casoSorteado ? casoSorteado : enSorteo ? casoActual : "-"}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            label={enSorteo ? "Sorteando..." : "Iniciar Sorteo"}
            icon="pi pi-refresh"
            className={`mt-6 px-8 py-3 text-lg font-semibold rounded-lg shadow-sm border-none ${
              enSorteo
                ? "bg-gray-400 text-white"
                : "bg-[#e11d1d] text-white hover:bg-[#be1414]"
            }`}
            disabled={enSorteo}
            onClick={iniciarSorteo}
          />
        </div>
        {(areaSorteada || casoSorteado) && !enSorteo && (
          <div className="flex flex-col items-center mt-8 mb-2">
            <div className="flex items-center text-green-600 text-xl font-bold">
              <i className="pi pi-check-circle mr-2 text-2xl" />
              Sorteo finalizado
            </div>
            <p className="text-gray-700 mt-2 mb-2">
              ¡Éxito! Ya tienes tus asignaciones.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
