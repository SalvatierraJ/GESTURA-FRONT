import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Prototipo from "@/features/Administrador/components/prototipo";
import ProtectedRoute from "@/store/authGuardRoute";
import PublicRoute from "@/store/publicRoute";
import "@/index.css";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home />}>
          <Route path="docentes" element={<Docente />} />
          <Route path="casos" element={<CasosDeEstudio />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="defensas" element={<DefensaProgramada />} />
          <Route path="plantillasGeneradas" element={<DocumentosGenerados />} />
          <Route path="plantillas" element={<Plantillas />} />
          <Route path="ajustes" element={<Ajustes />} />
          <Route path="acceso" element={<Acceso />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Estudiante"]} />}>
        <Route path="/estudiante" element={<Home />}>
          <Route path="misDefensas" element={<MisDefensas />} />
          <Route
            path="misDefensas/detallesDefensa"
            element={<DefensaDetalles />}
          />
          <Route path="prototipo" element={<Prototipo />} />
          <Route path="ajustes" element={<Ajustes />} />
          <Route path="plantillasGeneradas" element={<DocumentosGenerados />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
