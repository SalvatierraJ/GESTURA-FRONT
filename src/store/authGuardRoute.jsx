import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedAdminRoute() {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/" replace />;

  const userRoles = user.roles?.map(r => (r.Nombre || "").trim().toLowerCase()) || [];
  const hasAccess = userRoles.some(r => r !== "Estudiante");
  if (hasAccess) return <Outlet />;
  return <Navigate to="/estudiante" replace />;
}
