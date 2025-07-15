export const sidebarOptions = [
  {
    type: "section",
    label: "Dashboard",
  },

  {
    iconClass: "fas fa-home",
    label: "Inicio",
    to: "/home",
    roles: ["Estudiante"],
  },
  {
    iconClass: "fas fa-calendar-days",
    label: "Mis Defensas",
    to: "/estudiante/misDefensas",
    roles: ["Estudiante"],
  },
  {
    iconClass: "fas fa-briefcase",
    label: "Casos de Estudio",
    to: "/home/casos",
  },
  {
    iconClass: "fas fa-chalkboard-teacher",
    label: "Gestion de Docentes",
    to: "/home/docentes",
  },
  {
    iconClass: "fas fa-user-graduate",
    label: "Gestion de Estudiantes",
    to: "/home/estudiantes",
  },
  {
    iconClass: "fas fa-book-reader",
    label: "Defensas Programadas",
    to: "/home/defensas",
    roles: ["Admin", "jefe"],
  },
  {
    type: "section",
    label: "Reportes",
  },
  {
    iconClass: "fas fa-chart-bar",
    label: "Reportes",
    to: "/home/prototipo",
    roles: ["Admin", "jefe"],
  },
  {
    iconClass: "fas fa-chart-bar",
    label: "Reportes",
    to: "/estudiante/prototipo",
    roles: ["Estudiante"],
  },
  {
    iconClass: "fas fa-file-alt",
    label: "Plantillas",
    to: "/home/plantillas",
    roles: ["Admin", "jefe"],
  },
  // Compartidas
  {
    iconClass: "fas fa-file-alt",
    label: "Plantillas Generadas",
    to: "/home/plantillasGeneradas",
    roles: ["Admin", "jefe"],
  },
  {
    iconClass: "fas fa-file-alt",
    label: "Plantillas Generadas",
    to: "/estudiante/plantillasGeneradas",
    roles: ["Estudiante"],
  },
  {
    type: "section",
    label: "Comunicación",
  },
  {
    iconClass: "fas fa-envelope",
    label: "Mensajes",
    to: "/home/mensajes",
    roles: ["Admin", "jefe"],
  },
  {
    type: "section",
    label: "Configuraciones",
  },
  {
    iconClass: "fas fa-user-shield",
    label: "Control de Acceso",
    to: "/home/acceso",
    roles: ["Admin", "jefe"],
  },
  {
    iconClass: "fas fa-cog",
    label: "Ajustes",
    to: "/home/ajustes",
    roles: ["Admin", "jefe"],
  },

];