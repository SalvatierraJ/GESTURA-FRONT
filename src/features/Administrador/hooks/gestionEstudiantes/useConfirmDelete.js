import { useState } from "react";

export default function useConfirmDelete() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState({ id: null, name: "" });

  const askDelete = (name, id) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };

  const close = () => setConfirmOpen(false);

  return { confirmOpen, toDelete, askDelete, close };
}
