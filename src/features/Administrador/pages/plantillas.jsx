import ManagementLayout from "@/components/administradorContenido";
import SubirPlantilla from "@/features/Administrador/components/subir_plantilla";
const files = [
  {
    id: 1,
    icon: "fa-file-pdf",
    color: "text-blue-500",
    title: "Offer Letter Template V2",
    category: "Offer Letter",
    uploaded: "2023-10-26",
  },
  {
    id: 2,
    icon: "fa-file-pdf",
    color: "text-blue-500",
    title: "Internship Agreement",
    category: "Internship Agreement",
    uploaded: "2023-09-15",
  },
  {
    id: 3,
    icon: "fa-file-pdf",
    color: "text-blue-500",
    title: "NDA Template (Confidenti...",
    category: "Non-Disclosure Agreement",
    uploaded: "2023-08-01",
  },
  {
    id: 4,
    icon: "fa-file-pdf",
    color: "text-blue-500",
    title: "Company Policy Overview",
    category: "Other",
    uploaded: "2023-07-20",
  },
];

function FileCard({ icon, color, title, category, uploaded }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-5 min-w-[320px] max-w-[340px] h-[178px] mb-5 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <i className={`far ${icon} ${color} text-2xl`} aria-hidden="true"></i>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-blue-600">
            <i className="fas fa-pen text-lg"></i>
          </button>
          <button className="text-red-400 hover:text-red-600">
            <i className="fas fa-trash-alt text-lg"></i>
          </button>
        </div>
      </div>
      <div className="mt-3">
        <div className="font-semibold text-gray-800 text-base leading-tight truncate max-w-[250px]">
          {title}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Category: <span className="text-gray-500">{category}</span>
        </div>
        <div className="text-xs text-gray-400">
          Uploaded: <span className="text-gray-500">{uploaded}</span>
        </div>
      </div>
      <button className="flex items-center justify-center w-full mt-auto rounded-lg border border-gray-200 bg-[#f7fafd] hover:bg-gray-200 text-gray-700 py-2 text-sm font-medium transition-colors duration-100">
        <i className="fas fa-download mr-2"></i> Download
      </button>
    </div>
  );
}

function Plantillas() {
  const actions = [
    <div key="search" className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        placeholder="Search"
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>,
    <SubirPlantilla
      onUpload={(data) => console.log("Plantilla subida:", data)}
    />,
  ];
  return (
    <ManagementLayout title="Gestión de Plantillas" actions={actions}>
      <div className="w-full h-full min-h-[80vh] bg-[#f7fafd] rounded-2xl p-4">
        <div className="flex flex-wrap gap-x-7 gap-y-6">
          {files.map((file) => (
            <FileCard key={file.id} {...file} />
          ))}

          <div className="invisible min-w-[320px] max-w-[340px] h-[178px]"></div>
        </div>
      </div>
    </ManagementLayout>
  );
}

export default Plantillas;
