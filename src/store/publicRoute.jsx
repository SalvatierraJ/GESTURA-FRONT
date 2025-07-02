
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function PublicRoute() {
  const { role } = useAuthStore();
  if (role === "Admin" || role === "jefe") return <Navigate to="/home" replace />;
  if (role === "Estudiante") return <Navigate to="/estudiante" replace />;
  return <Outlet />; 
}
