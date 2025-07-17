 import {useEffect, useMemo, useState} from 'react';
 import {useAuthStore} from '../../../store/authStore';


 function ProfileForm() {
  const usuario_formulario = useAuthStore(state => state.user); 
  const { updateProfile} = useAuthStore();
  const [formValues, setFormValues] = useState({
    nombres: '',
    apellidos: '',
    usuario: '',
    correo: '',
    contrasena: '',
  });
  useEffect(()=>{ 
    if (usuario_formulario) {
      setFormValues({
        nombres: usuario_formulario.Persona?.Nombre || '',
        apellidos: `${usuario_formulario.Persona?.Apellido1 || ''} ${usuario_formulario.Persona?.Apellido2 || ''}`.trim(),
        correo: usuario_formulario.Nombre_usuario || '',
        usuario: '', 
        contrasena: '', 
      });
    }
  }, [usuario_formulario]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!usuario_formulario) return; 

    const [apellido1, ...apellido2Parts] = formValues.apellidos.split(' ');
    const apellido2 = apellido2Parts.join(' ');

    const payload = {
      Persona: {
        Nombre: formValues.nombres,
        Apellido1: apellido1 || '',
        Apellido2: apellido2 || '',
      },
      Nombre_Usuario: formValues.correo,
    };
    if (formValues.contrasena && formValues.contrasena.trim() !== '') {
      payload.Password = formValues.contrasena;
    }

    console.log('Payload que se enviará a la API:', payload);

    const result = "exito";

    if (result.success) {
      alert('¡Perfil actualizado con éxito!');
    } else {
      alert(`Error: ${result.error || 'No se pudo actualizar el perfil.'}`);
    }
  };
    return (
      <form className="flex flex-col space-y-4 flex-1 max-w-[350px]" onSubmit={handleSubmit}>
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
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Apellidos
          </label>
          <input
          name="apellidos"
          value={formValues.apellidos}
          onChange={handleInputChange}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Contrasena
          </label>
          <input
          name="contrasena"
          value={formValues.contrasena}
          onChange={handleInputChange}
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
         {/* Botón de actualizar */}
         <div className="flex flex-row justify-end mt-4">
            <button className="bg-red-700 hover:bg-red-800 text-white px-7 py-2 rounded-full text-base font-semibold" type='submit'>
              Actualizar
            </button>
          </div>
      </form>
    );
  }

  function ProfilePage() { 
    const user = useAuthStore(state => state.user);
    const rol_user = useAuthStore(state => state.getRoles());
    const carreras = useMemo(()=>{
      if(!user) return [];
      return user.roles?.flatMap((r)=> r.carreras) || [];
    });
    return (
      <div className="w-full min-h-screen px-8 pt-8">
        <div className="max-w-6xl mx-auto">
          {/* Título y descripción */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
            <div className="mt-1 text-gray-500 text-[15px]">
              Administra los ajuste de tu cuenta y perfil
            </div>
          </div>

          {/* Formulario y avatar */}
          <div className="mt-8 flex flex-row items-start justify-between">
            {/* Formulario */}
            <div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                Informacion Personal
              </div>
              <ProfileForm />
            </div>
            {/* Avatar */}
            <div className="flex flex-1 justify-end">
              <img
                src="https://placehold.co/220x220/png?text=Avatar"
                alt="Imagen de perfil usuario genérica fondo azul"
                className="rounded-full border-4 border-dashed border-gray-300 w-[220px] h-[220px] object-cover"
              />
            </div>
          </div>

          {/* Carreras asignadas */}
          {( user.roles[0].Nombre !== "Estudiante" && rol_user.nombre !== "Estudiante")   && (
  <div className="mt-10">
    <div className="text-lg font-bold text-gray-900 mb-4">
      Carreras Asignadas
    </div>
    
    {/* Contenedor flexible que permite que los elementos se envuelvan */}
    <div className="flex flex-wrap gap-4">

      {/* Mapeamos cada carrera a una "etiqueta" compacta */}
      {carreras.map(carrera => (
        <div 
          key={carrera.id_carrera} 
          className="flex items-center space-x-3 bg-slate-100 border border-slate-200 
                     rounded-full py-2 px-4 transition-all hover:bg-slate-200"
        >
          {/* Icono con el color solicitado */}
          <div className="bg-red-700 text-white rounded-full p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            </svg>
          </div>
          
          {/* Nombre de la carrera */}
          <span className="font-medium text-gray-700 text-sm">
            {carrera.nombre_carrera}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
          {/*Fin carreras asignadas */}
        </div>
      </div>
    );
  }

export default ProfilePage;
