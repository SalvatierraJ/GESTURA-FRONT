export default function TogglePill({ active, onClick, onLabel="Visible", offLabel="No visible" }) {
  return active ? (
    <span
      className="text-xs font-semibold bg-black text-white px-2 py-1 rounded-full cursor-pointer"
      title="Hacer no visible"
      onClick={onClick}
    >
      {onLabel}
    </span>
  ) : (
    <span
      className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-full cursor-pointer"
      title="Hacer visible"
      onClick={onClick}
    >
      {offLabel}
    </span>
  );
}
