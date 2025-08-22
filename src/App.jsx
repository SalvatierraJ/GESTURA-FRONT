import { Routes, Route } from "react-router-dom";
import Login from "@/layout/login";
import Home from "@/layout/mainLayout";
import Docente from "@/features/Administrador/pages/gestionDocentes";
import CasosDeEstudio from "@/features/Administrador/pages/gestionDeCasos";
import Estudiantes from "@/features/Administrador/pages/gestionDeEstudiantes";
import DefensaProgramada from "@/features/Administrador/pages/defensasProgramadas";
import DocumentosGenerados from "@/features/Administrador/pages/documentosGenerados";
import Plantillas from "@/features/Administrador/pages/plantillas";
import Ajustes from "@/features/Administrador/pages/perfil";
import Acceso from "@/features/Administrador/pages/controlDeAcceso";
import MisDefensas from "@/features/Estudiantes/pages/MisDefensas";
import DefensaDetalles from "@/features/Estudiantes/pages/detallesDefensa";
import RegistroMateria from "@/features/Administrador/pages/RegistroMateria";
import Pensum from "@/features/Administrador/pages/pensum";
import Prototipo from "@/features/Administrador/components/prototipo";
import ProtectedRoute from "@/store/authGuardRoute";
import PublicRoute from "@/store/publicRoute";
import "@/index.css";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { fetchProfile } from "@/services/auth";
import { Toaster } from "react-hot-toast";


function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile()
        .then((profile) => {
          setAuth(profile, token);
          setIsAuthLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }
  }, [setAuth]);

  if (isAuthLoading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
        <svg
          className="animate-spin h-10 w-10 text-red-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span className="text-red-700 text-xl font-bold">
          Cargando sesión...
        </span>
      </div>
    );
  }

  return (
    <>
   
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />}>
            <Route path="docentes" element={<Docente />} />
            <Route path="casos" element={<CasosDeEstudio />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="defensas" element={<DefensaProgramada />} />
            <Route
              path="plantillasGeneradas"
              element={<DocumentosGenerados />}
            />
            <Route path="plantillas" element={<Plantillas />} />
            <Route path="ajustes" element={<Ajustes />} />
            <Route path="acceso" element={<Acceso />} />
            <Route path="registro-materia" element={<RegistroMateria />} />
            <Route path="Pensum" element={<Pensum />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Estudiante"]} />}>
          <Route path="/estudiante" element={<Home />}>
            <Route path="misDefensas" element={<MisDefensas />} />
            <Route
              path="misDefensas/detallesDefensa/:id"
              element={<DefensaDetalles />}
            />
            <Route path="prototipo" element={<Prototipo />} />
            <Route path="ajustes" element={<Ajustes />} />
            <Route
              path="plantillasGeneradas"
              element={<DocumentosGenerados />}
            />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
