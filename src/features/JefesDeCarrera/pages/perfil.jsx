  function ProfileForm() {
    return (
      <form className="flex flex-col space-y-4 flex-1 max-w-[350px]">
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Nombres
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Apellidos
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Usuario
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Correo
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-base">
            Contrasena
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
          />
        </div>
      </form>
    );
  }

  function ProfilePage() {
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

          {/* Botón de actualizar */}
          <div className="flex flex-row justify-end mt-4">
            <button className="bg-red-700 hover:bg-red-800 text-white px-7 py-2 rounded-full text-base font-semibold">
              Actualizar
            </button>
          </div>

          {/* Carreras asignadas */}
          <div className="mt-10">
            <div className="text-lg font-bold text-gray-900 mb-3">
              Carreras Asignadas
            </div>
            <div className="w-full">
              <div className="rounded-xl border border-gray-400 bg-[#f3cece] flex items-center px-8 py-7 mb-6 min-h-[130px]">
                <div className="flex-1">
                  <div className="text-3xl md:text-3xl font-bold text-gray-800 leading-9">
                    Ingenieria de Sistemas
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <img
                    src="https://placehold.co/100x100/png?text=Chart"
                    alt="Ilustración de dashboard estadístico sobre fondo aqua claro"
                    className="rounded-lg shadow-md object-cover w-[110px] h-[90px] ml-3"
                    style={{ background: "#e2f0fa" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default ProfilePage;
