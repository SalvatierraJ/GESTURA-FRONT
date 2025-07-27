import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePensumStore } from "@/store/materia.store";

export default function usePensumProgramacion() {
  const [busqueda, setBusqueda] = useState("");
  const [accordion, setAccordion] = useState({});
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(true);
  const { pensum, fetchPensum, clearPensum } = usePensumStore();
  const { registrarInscripcionMateria, loadingRegistrar } = usePensumStore();

  const HORARIOS_FIJOS = [
    { label: "07:15-10:00", turno: "MAÑANA", extra: "" },
    { label: "10:15-13:00", turno: "MAÑANA", extra: "" },
    { label: "13:15-16:00", turno: "TARDE", extra: "" },
    { label: "15:00-19:00", turno: "TARDE", extra: "SEMI-PRESENCIAL" },
    { label: "16:15-19:00", turno: "TARDE", extra: "" },
    { label: "19:30-21:30", turno: "NOCHE", extra: "SEMI-PRESENCIAL" },
    { label: "19:15-21:45", turno: "NOCHE", extra: "" },
  ];
  const MODULOS = [0, 1, 2, 3, 4, 5];
  const estudiante = pensum?.[0]?.estudiante;
  const materias = pensum?.[0]?.materias || [];
  const materiasPorSemestre = {};
  materias.forEach((mat) => {
    const sem = parseInt(mat.semestre, 10);
    if (!materiasPorSemestre[sem]) materiasPorSemestre[sem] = [];
    materiasPorSemestre[sem].push(mat);
  });
  const semestres = Object.keys(materiasPorSemestre)
    .map(Number)
    .sort((a, b) => a - b);
  const semImpares = semestres.filter((s) => s % 2 === 1);
  const semPares = semestres.filter((s) => s % 2 === 0);
  const materiasProgramables = materias.filter((m) => m.puedeCursar);

  function totalMateriasCarrito() {
    return cart.reduce((total, mat) => {
      return total + (mat.horario?.bimodular ? 2 : 1);
    }, 0);
  }
  const totalMat = totalMateriasCarrito();
  const limiteAlcanzado = totalMat >= 8;

  const nombreCompleto = estudiante
    ? `${estudiante.Apellido1 ?? ""} ${estudiante.Apellido2 ?? ""} ${
        estudiante.Nombre ?? ""
      }`.trim()
    : "";

  useEffect(() => {
    if (limiteAlcanzado) {
      toast.dismiss();
      toast.error("¡Límite máximo de 8 materias alcanzado!", {
        duration: 4000,
      });
    }
  }, [limiteAlcanzado]);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;
    await fetchPensum(busqueda.trim());
  };
  useEffect(() => {
    if (!busqueda) clearPensum();
  }, [busqueda, clearPensum]);
  function horasSolapan(a1, a2, b1, b2) {
    return a1 < b2 && b1 < a2;
  }
  function parseHora(h) {
    return h.replace(":", "");
  }
  function hayConflicto(
    horarioNuevo,
    moduloNuevo,
    moduloFinNuevo,
    horaInicioNuevo,
    horaFinNuevo
  ) {
    return cart.some((item) => {
      const modIniA = item.modulo_inicio ?? 0;
      const modFinA = item.modulo_fin ?? item.modulo_inicio ?? 0;
      const modIniB = moduloNuevo ?? 0;
      const modFinB = moduloFinNuevo ?? moduloNuevo ?? 0;
      const moduloSolapado = !(modFinA < modIniB || modFinB < modIniA);
      if (!moduloSolapado) return false;
      const [startA, endA] = (item.horario.horario || "")
        .split("-")
        .map((x) => parseHora(x.trim()));
      const [startB, endB] = [horaInicioNuevo, horaFinNuevo];
      if (!startA || !startB) return false;
      return horasSolapan(startA, endA, startB, endB);
    });
  }
  function handleAddToCart(mat, horarioIdx) {
    const horario = mat.horariosAbiertos[horarioIdx];
    const moduloInicio = horario.modulo_inicio ?? 0;
    const moduloFin = horario.bimodular
      ? horario.modulo_fin ?? moduloInicio + 1
      : moduloInicio;
    const [hInicio, hFin] = horario.horario.split("-").map((x) => x.trim());
    if (
      hayConflicto(
        horario,
        moduloInicio,
        moduloFin,
        parseHora(hInicio),
        parseHora(hFin)
      )
    ) {
      toast.error(
        "¡No puedes agregar esta materia! Hay conflicto de horario o módulo con otra materia en tu carrito."
      );
      return;
    }
    setCart([
      ...cart,
      {
        codigo: mat.codigo,
        codigo_horario: horario.codigo_horario,
        siglas: mat.siglas,
        nombre: mat.nombre,
        horario,
        modulo_inicio: moduloInicio,
        modulo_fin: moduloFin,
        horarioIdx,
        gestion: horario.gestion
      },
    ]);
    toast.success("Materia añadida al carrito");
  }
  function handleRemoveFromCart(idx) {
    setCart(cart.filter((_, i) => i !== idx));
  }
  function isInCart(siglas, horarioIdx) {
    return cart.some(
      (item) => item.siglas === siglas && item.horarioIdx === horarioIdx
    );
  }
  const toggleAccordion = (semestre) =>
    setAccordion((a) => ({ ...a, [semestre]: !a[semestre] }));
  const todasAprobadas = (materiasSemestre) =>
    materiasSemestre.every((mat) => mat.estado === "aprobada");

 async function handleRegistrarMaterias() {
    if (!estudiante?.Id_Persona) {
      toast.error("No se encontró el estudiante.");
      return;
    }
    if (cart.length === 0) {
      toast.error("No hay materias en el carrito.");
      return;
    }

    const payload = {
      id_persona: estudiante.Id_Persona,
      gestion: cart[0]?.gestion,
      materias: cart.map((item) => ({
        codigo: item.codigo,
        codigo_horario: item.codigo_horario,
      })),
    };

    try {
      const res = await registrarInscripcionMateria(payload);

      if (res.ok) {
        toast.success("¡Materias registradas con éxito!");
        setCart([]);
      } else {
        toast.error(res.message || "Algunas materias no se registraron.");
      
        if (res.rechazadas?.length) {
          res.rechazadas.forEach(r =>
            toast.error(` ${r.nombre}: ${r.motivo}`)
          );
        }
      }
    } catch (err) {
      toast.error("Ocurrió un error al registrar las materias.");
      console.error(err);
    }
  }

  return {
    busqueda,
    setBusqueda,
    handleSearch,
    materias,
    materiasPorSemestre,
    semImpares,
    semPares,
    accordion,
    setAccordion,
    toggleAccordion,
    todasAprobadas,
    cart,
    setCart,
    showCart,
    setShowCart,
    totalMat,
    limiteAlcanzado,
    handleRemoveFromCart,
    isInCart,
    handleAddToCart,
    materiasProgramables,
    HORARIOS_FIJOS,
    nombreCompleto,
    pensum,
    handleRegistrarMaterias,
    loadingRegistrar,
    MODULOS
  };
}
