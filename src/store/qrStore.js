import { create } from 'zustand';
import {
  obtenerQR,
  obtenerEstado,
  inicializarWhatsApp,
  reiniciarWhatsApp,
} from '@/services/whatsapp-service';

export const useQrStore = create((set, get) => ({
  qrImage: null,
  qrCode: null,
  whatsappStatus: 'disconnected',
  isReady: false,
  loading: false,
  error: null,

  obtenerQR: async () => {
    set({ loading: true, error: null });
    try {
      const response = await obtenerQR();
      if (response.success) {
        set({
          qrImage: response.qrImage,
          qrCode: response.qrCode,
          loading: false,
        });
      } else {
        set({
          error: response.message,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.message || 'Error al obtener QR',
        loading: false,
      });
    }
  },

  obtenerEstado: async () => {
    try {
      const response = await obtenerEstado();
      set({
        whatsappStatus: response.state,
        isReady: response.isReady,
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  inicializarWhatsApp: async () => {
    set({ loading: true, error: null });
    try {
      const response = await inicializarWhatsApp();
      set({ loading: false });

      setTimeout(() => {
        get().obtenerEstado();
      }, 2000);

      return response;
    } catch (error) {
      set({
        error: error.message || 'Error al inicializar WhatsApp',
        loading: false,
      });
    }
  },

  reiniciarWhatsApp: async () => {
    set({ loading: true, error: null });
    try {
      const response = await reiniciarWhatsApp();
      set({
        loading: false,
        qrImage: null,
        qrCode: null,
        whatsappStatus: 'connecting',
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Error al reiniciar WhatsApp',
        loading: false,
      });
    }
  },

  limpiarError: () => set({ error: null }),
  limpiarQR: () => set({ qrImage: null, qrCode: null }),

  iniciarPolling: () => {
    const interval = setInterval(() => {
      const { whatsappStatus } = get();
      if (whatsappStatus === 'qr_pending' || whatsappStatus === 'connecting') {
        get().obtenerEstado();
        get().obtenerQR();
      }
      if (whatsappStatus === 'ready') {
        clearInterval(interval);
      }
    }, 3000);

    return interval;
  },
}));
