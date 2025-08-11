import { Dropdown } from "primereact/dropdown";

export default function SelectorMateria({ materias, materiaSeleccionada, setMateriaSeleccionada }) {
  const materiaOptions = materias.map((mat) => ({
    label: `${mat.nombre} (${mat.sigla})`,
    value: mat.id,
  }));

  return (
    <div className="mb-10 flex items-center gap-6">
      <label className="font-bold text-lg text-black">Materia:</label>
      <Dropdown
        value={materiaSeleccionada}
        options={materiaOptions}
        onChange={(e) => setMateriaSeleccionada(e.value)}
        placeholder="-- Selecciona materia --"
        className="w-96"
        filter 
        showClear 
      />
    </div>
  );
}
