import { useEffect, useState, useRef, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { obtenerQR, inicializarWhatsApp, obtenerEstado } from "../../../services/qr.services";

// Formulario de perfil con loading y toast
function ProfileForm() {
  const usuario_formulario = useAuthStore((state) => state.user);
  const { updateProfile } = useAuthStore();

  const [formValues, setFormValues] = useState({
    nombres: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    ci: "",
    telefono: "",
    usuario: "",
    contrasena: "",
  });

  const [saving, setSaving] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    if (usuario_formulario) {
      setFormValues({
        nombres: usuario_formulario.Persona?.Nombre || "",
        apellido1: usuario_formulario.Persona?.Apellido1 || "",
        apellido2: usuario_formulario.Persona?.Apellido2 || "",
        correo: usuario_formulario.Persona?.Correo || "",
        ci: usuario_formulario.Persona?.CI || "",
        telefono: usuario_formulario.Persona?.telefono ? String(usuario_formulario.Persona.telefono) : "",
        usuario: usuario_formulario.Nombre_Usuario || "",
        contrasena: "",
      });
    }
  }, [usuario_formulario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario_formulario) return;

    setSaving(true);

    const payload = {
      Persona: {
        Nombre: formValues.nombres,
        Apellido1: formValues.apellido1,
        Apellido2: formValues.apellido2,
        Correo: formValues.correo,
        CI: formValues.ci,
        telefono: formValues.telefono ? Number(formValues.telefono) : null,
      },
      Nombre_Usuario: formValues.usuario,
    };
    if (formValues.contrasena && formValues.contrasena.trim() !== "") {
      payload.Password = formValues.contrasena;
    }

    const result = await updateProfile(payload);
    setSaving(false);

    if (result.success || result === "exito") {
      toast.current.show({
        severity: "success",
        summary: "¡Perfil actualizado!",
        detail: "Tus datos fueron actualizados correctamente.",
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: result.error || "No se pudo actualizar el perfil.",
        life: 3500,
      });
    }
  };

  return (
    <form
      className="flex flex-col space-y-4 flex-1 max-w-[370px] relative"
      onSubmit={handleSubmit}
      style={{ position: "relative" }}
    >
      <Toast ref={toast} />
      {saving && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <i className="pi pi-spin pi-spinner text-3xl text-[#e11d1d] mb-3" />
          <span className="text-[#e11d1d] font-semibold text-lg">Guardando cambios...</span>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Nombres
        </label>
        <input
          name="nombres"
          value={formValues.nombres}
          onChange={handleInputChange}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Apellido paterno
        </label>
        <input
          name="apellido1"
          value={formValues.apellido1}
          onChange={handleInputChange}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Apellido materno
        </label>
        <input
          name="apellido2"
          value={formValues.apellido2}
          onChange={handleInputChange}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Correo
        </label>
        <input
          name="correo"
          value={formValues.correo}
          onChange={handleInputChange}
          type="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          CI
        </label>
        <input
          name="ci"
          value={formValues.ci}
          onChange={handleInputChange}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Teléfono
        </label>
        <input
          name="telefono"
          value={formValues.telefono}
          onChange={handleInputChange}
          type="tel"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Usuario
        </label>
        <input
          name="usuario"
          value={formValues.usuario}
          onChange={handleInputChange}
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700 text-base">
          Nueva contraseña (opcional)
        </label>
        <input
          name="contrasena"
          value={formValues.contrasena}
          onChange={handleInputChange}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          disabled={saving}
        />
      </div>
      <div className="flex flex-row justify-end mt-4">
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-7 py-2 rounded-full text-base font-semibold"
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <i className="pi pi-spin pi-spinner" />
              Guardando...
            </span>
          ) : (
            "Actualizar"
          )}
        </button>
      </div>
    </form>
  );
}

// Componente de página de perfil
function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [whatsappState, setWhatsappState] = useState(null);
  
  const carreras = useMemo(() => {
    if (!user) return [];
    // Soporta múltiples roles con carreras
    return user.roles?.flatMap((r) => r.carreras) || [];
  }, [user]);

  const handleGenerateQR = async () => {
    setShowQRModal(true);
    setLoadingQR(true);
    setQrError(null);
    
    try {
      // Paso 1: Verificar estado actual
      const estadoActual = await obtenerEstado();
      setWhatsappState(estadoActual.state);
      console.log('Estado actual de WhatsApp:', estadoActual);
      
      // Paso 2: Inicializar si es necesario
      if (estadoActual.state === 'disconnected' || estadoActual.state === 'error') {
        console.log('Inicializando WhatsApp...');
        await inicializarWhatsApp();
        
        // Esperar un poco para que se inicialice
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Paso 3: Obtener el QR
      const qrResponse = await obtenerQR();
      
      if (qrResponse.success) {
        setQrData(qrResponse);
        console.log('QR obtenido exitosamente');
      } else {
        setQrError(qrResponse.message || 'No se pudo generar el código QR');
        console.log('Error al obtener QR:', qrResponse.message);
      }
    } catch (error) {
      console.error('Error al generar QR:', error);
      setQrError('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoadingQR(false);
    }
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setQrData(null);
    setQrError(null);
  };
  return (
    <div className="w-full min-h-screen px-8 pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Título y descripción */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <div className="mt-1 text-gray-500 text-[15px]">
            Administra los ajustes de tu cuenta y perfil
          </div>
        </div>
        {/* Formulario y avatar */}
        <div className="mt-8 flex flex-row items-start justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900 mb-2">
              Información Personal
            </div>
            <ProfileForm />
          </div>
          <div className="flex flex-1 justify-end">
            <img
              src="https://placehold.co/220x220/png?text=Avatar"
              alt="Imagen de perfil usuario genérica fondo azul"
              className="rounded-full border-4 border-dashed border-gray-300 w-[220px] h-[220px] object-cover"
            />
          </div>
        </div>

        {/* Carreras asignadas */}
        {carreras.length > 0 && (
          <div className="mt-10">
            <div className="text-lg font-bold text-gray-900 mb-4">
              Carreras Asignadas
            </div>
            <div className="flex flex-wrap gap-4">
              {carreras.map((carrera) => (
                <div
                  key={carrera.id_carrera}
                  className="flex items-center space-x-3 bg-slate-100 border border-slate-200 
                     rounded-full py-2 px-4 transition-all hover:bg-slate-200"
                >
                  <div className="bg-red-700 text-white rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700 text-sm">
                    {carrera.nombre_carrera}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
  {user.Nombre_Usuario === "admin" && (
        <div className="mt-10">
          <div className="text-lg font-bold text-gray-900 mb-4">
            Código QR Mensajes Whatsapp
          </div>
          <button
            onClick={handleGenerateQR}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full text-base font-semibold flex items-center gap-2 transition-colors"
          >
            <i className="pi pi-qrcode" />
            Generar QR
          </button>
        </div>
      )}

      <Dialog
        header="Código QR - Mensajes WhatsApp"
        visible={showQRModal}
        style={{ width: '450px' }}
        modal
        onHide={handleCloseQRModal}
        draggable={false}
        resizable={false}
        className="p-fluid"
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">
              Escanea este código QR con WhatsApp para conectar tu cuenta
            </p>
            {whatsappState && (
              <p className="text-xs text-blue-600 mt-2">
                Estado: {whatsappState === 'qr_pending' ? 'Esperando escaneo QR' : 
                        whatsappState === 'ready' ? 'Conectado y listo' :
                        whatsappState === 'connecting' ? 'Conectando...' :
                        whatsappState === 'disconnected' ? 'Desconectado' : whatsappState}
              </p>
            )}
          </div>
          
          <div className="w-64 h-64 border border-gray-200 rounded-lg overflow-hidden bg-white p-4 shadow-sm flex items-center justify-center">
            {loadingQR ? (
              <div className="text-center">
                <i className="pi pi-spin pi-spinner text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-sm">Generando código QR...</p>
              </div>
            ) : qrError ? (
              <div className="text-center">
                <i className="pi pi-exclamation-triangle text-3xl text-red-400 mb-2"></i>
                <p className="text-red-500 text-sm">{qrError}</p>
              </div>
            ) : qrData?.qrImage ? (
              <img
                src={qrData.qrImage}
                alt="Código QR WhatsApp"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <i className="pi pi-qrcode text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-sm">QR no disponible</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleGenerateQR}
              disabled={loadingQR}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <i className={`pi ${loadingQR ? 'pi-spin pi-spinner' : 'pi-refresh'}`} />
              {loadingQR ? 'Generando...' : 'Regenerar QR'}
            </button>
            <button
              onClick={handleCloseQRModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Dialog>

      </div>
    </div>
  );
}

export default ProfilePage;
