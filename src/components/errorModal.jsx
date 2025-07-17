import { motion, AnimatePresence } from 'framer-motion';

const ErrorModal = ({ show, onClose, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
          >
            {/* Icono de Error */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <div className="bg-red-700 text-white rounded-full p-2">
                <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Título y Mensaje */}
            <h3 className="text-2xl font-bold text-gray-800 mt-5">Error de Autenticación</h3>
            <p className="text-gray-600 my-3">
              {message}
            </p>

            {/* Botón de Salida */}
            <button
              onClick={onClose}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
            >
              Intentar de Nuevo
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;