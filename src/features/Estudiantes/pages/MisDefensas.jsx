import { Link } from 'react-router-dom';
const defenses = [
  {
    title: "Defensa de Proyecto Final",
    type: "Interna",
    badgeColor: "bg-green-100 text-green-600",
    date: "15 de Agosto, 2024",
    time: "10:00 AM",
    place: "Auditorio Principal",
  },
  {
    title: "Defensa de Tesis",
    type: "Externa",
    badgeColor: "bg-blue-100 text-blue-600",
    date: "22 de Septiembre, 2024",
    time: "02:30 PM",
    place: "Sala de Conferencias B",
  },
  {
    title: "Avance de Proyecto II",
    type: "Interna",
    badgeColor: "bg-yellow-100 text-yellow-600",
    date: "05 de Noviembre, 2024",
    time: "09:00 AM",
    place: "Laboratorio C-103",
  },
];
function DefenseCard({ defense }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-w-[325px] max-w-[350px] w-full flex flex-col mb-3 border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-gray-800 leading-tight">
          {defense.title}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${defense.badgeColor} ml-2`}
        >
          {defense.type}
        </span>
      </div>
      <div className="flex flex-col gap-1 mb-3 mt-1">
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-calendar-alt text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Fecha:</span> {defense.date}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="far fa-clock text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Hora:</span> {defense.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
          <span>
            <span className="font-medium">Lugar:</span> {defense.place}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2"></div>
      <div className="flex justify-end">
        <Link
          to="detallesDefensa"
          className="text-red-600 font-medium text-sm hover:underline flex items-center"
        >
          Ver Detalles <span className="ml-1">&#8594;</span>
        </Link>
      </div>
    </div>
  );
}

function MisDefensas() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Mis Defensas Programadas
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-7">
          {defenses.map((defense, i) => (
            <DefenseCard defense={defense} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default MisDefensas;
