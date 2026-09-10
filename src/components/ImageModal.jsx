import { motion } from "framer-motion"
import { createPortal } from "react-dom"
import { FiX } from "react-icons/fi"

//Componente para ver las imagenes en grande

const ImageModal = ({ imagen, onClose }) => {
  if (!imagen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
      />

      {/* Contenido (Imagen) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors backdrop-blur-md"
        >
          <FiX size={24} />
        </button>
        <img
          src={imagen}
          alt="Vista ampliada"
          className="w-full h-full object-contain max-h-[90vh] bg-oscuro-900"
        />
      </motion.div>
    </div>,
    document.body
  )
}

export default ImageModal
