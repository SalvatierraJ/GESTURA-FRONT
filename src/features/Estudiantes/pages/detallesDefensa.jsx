function Badge({ children, color }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {children}
    </span>
  );
}
function DefenseSummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 w-full max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg text-gray-800 leading-tight">
          Defensa de Proyecto Final
        </div>
        <Badge color="bg-green-100 text-green-700">Interna</Badge>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-calendar-alt text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Fecha</span>
            <div className="ml-0">15 de Agosto, 2024</div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-clock text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Hora</span>
            <div className="ml-0">10:00 AM</div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="fas fa-map-marker-alt text-red-500 mr-2 text-lg"></i>
          <div>
            <span className="font-medium">Lugar</span>
            <div className="ml-0">Auditorio Principal</div>
          </div>
        </div>
        <div className="flex items-start text-sm text-gray-700">
          <i className="far fa-file-alt text-red-500 mr-2 text-lg pt-1"></i>
          <div>
            <span className="font-medium">Descripción</span>
            <div className="ml-0">
              Presentación y defensa del proyecto final de la materia
              "Ingeniería de Software Avanzada". Se evaluará la documentación,
              implementación y presentación oral del proyecto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyCaseCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 min-w-[270px] max-w-[270px]">
      <div className="font-medium text-gray-900 mb-3">Caso de Estudio</div>
      <div className="bg-[#f7f8fa] border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <i className="far fa-file-pdf text-2xl text-red-400"></i>
          <div>
            <div className="font-semibold text-sm text-gray-800">
              Estudio_Caso_Final.pdf
            </div>
            <div className="text-xs text-gray-500">
              Subido: 10 Agosto, 2024 - 2.5 MB
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition">
            <i className="far fa-eye mr-2"></i> Ver
          </button>
          <button className="bg-red-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-red-700 font-medium transition">
            <i className="fas fa-download mr-2"></i> Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectDocsSection() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 w-full">
      <div className="font-medium text-gray-900 mb-3">
        Documentos de la Defensa
      </div>
      <div className="mb-2 text-sm text-gray-700 font-semibold">
        Documento del Proyecto (PDF)
      </div>
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 bg-[#f7f8fa] rounded-xl">
        <i className="fas fa-upload text-gray-400 text-4xl mb-3"></i>
        <div className="text-gray-500 text-sm">
          Arrastra y suelta tu archivo aquí o haz clic para subir.
        </div>
      </div>
    </div>
  );
}

function DefenseDetails() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] py-7 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles de la Defensa
          </h2>
          <a
            href="#"
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <span className="mr-1">&#8592;</span> Volver a Mis Defensas
          </a>
        </div>
        <div className="flex gap-6 mb-6 flex-wrap">
          <DefenseSummaryCard />
          <StudyCaseCard />
        </div>
        <ProjectDocsSection />
      </div>
    </div>
  );
}
export default DefenseDetails;
