
import { create } from "zustand";

export const useChatbotStore = create((set) => ({
  history: [],
  loading: false,
  error: null,
  setHistory: (history) => set({ history }),
  addMessage: (msg) => set((state) => ({ history: [...state.history, msg] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetChat: () => set({ history: [], error: null }),
}));
