import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { createPortal } from "react-dom";

const IncompleteProfileNotification = () => {
  const navigate = useNavigate();
  const showIncompleteProfile = useAuthStore(
    (state) => state.showIncompleteProfile
  );
  const user = useAuthStore((state) => state.user);

  // TEMPORAL: Para testing, forzar la notificación siempre
  const forceShow = true; // Cambia esto a false cuando no quieras probar

  const handleRedirectToProfile = () => {
    // Determinar la ruta correcta basada en el rol del usuario
    const roles =
      user?.roles?.map((r) => (r.Nombre || "").trim().toLowerCase()) || [];

    if (roles.length === 1 && roles[0] === "estudiante") {
      navigate("/estudiante/ajustes");
    } else {
      navigate("/home/ajustes");
    }
  };

  // Solo mostrar si forzamos o si realmente el perfil está incompleto
  const shouldShow = showIncompleteProfile || forceShow;

  if (!shouldShow) {
    return null;
  }

  // Crear la notificación usando Portal para montarla directamente en el body
  const notificationContent = (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 999999,
        maxWidth: "350px",
        backgroundColor: "#f59e0b",
        background: "linear-gradient(135deg, #f59e0b, #ea580c)",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        padding: "16px",
        cursor: "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      onClick={handleRedirectToProfile}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "20px" }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div
            style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}
          >
            ¡Perfil incompleto!
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>
            Faltan datos en tu perfil. Haz clic para completar.
          </div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            cursor: "pointer",
            padding: "0",
            lineHeight: 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Click en X - Testing");
          }}
        >
          ×
        </button>
      </div>
    </div>
  );

  // Usar Portal para montar en el body
  return createPortal(notificationContent, document.body);
};

export default IncompleteProfileNotification;
