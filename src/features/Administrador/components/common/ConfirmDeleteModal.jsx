import React from "react";

export default function ConfirmDeleteModal({ open, name, entityLabel="registro", onClose, onConfirm }) {
  const [step, setStep] = React.useState(1);
  const [typed, setTyped] = React.useState("");

  React.useEffect(() => { if (open) { setStep(1); setTyped(""); } }, [open]);
  if (!open) return null;

  const canConfirm = typed.trim().toUpperCase() === "BORRAR";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-black bg-white shadow-xl">
        <div className="border-b border-black p-5">
          <h3 className="text-lg font-semibold text-black">Eliminar {entityLabel}</h3>
        </div>

        <div className="p-5 text-sm text-black">
          {step === 1 ? (
            <>
              <p className="mb-3">Vas a borrar lógicamente <span className="font-semibold">{name}</span>.</p>
              <p className="text-black/80">Esto lo ocultará de los listados (podrás restaurarlo luego).</p>
            </>
          ) : (
            <>
              <p className="mb-3">Escribe <span className="font-mono font-semibold">BORRAR</span> para confirmar.</p>
              <input
                autoFocus value={typed} onChange={(e)=>setTyped(e.target.value)} placeholder="BORRAR"
                className="w-full rounded-md border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-black p-5">
          <button onClick={onClose} className="rounded-md border border-black px-3 py-2 text-black transition hover:bg-black hover:text-white">Cancelar</button>
          {step === 1 ? (
            <button onClick={()=>setStep(2)} className="rounded-md bg-red-600 px-3 py-2 text-white transition hover:bg-red-700">Continuar</button>
          ) : (
            <button
              disabled={!canConfirm}
              onClick={()=>{ onConfirm(); onClose(); }}
              className={`rounded-md px-3 py-2 transition ${canConfirm ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-300 text-white cursor-not-allowed"}`}
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
