import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi"

// Componente para ver las imágenes en grande y navegar en galería

const ImageModal = ({ imagenes, imagen, indiceInicial = 0, onClose }) => {
  const lista =
    Array.isArray(imagenes) && imagenes.length > 0
      ? imagenes
      : imagen
      ? [imagen]
      : []

  const [indice, setIndice] = useState(() =>
    Math.min(Math.max(0, indiceInicial), Math.max(0, lista.length - 1))
  )

  const tieneMultiples = lista.length > 1

  const handlePrev = (e) => {
    if (e) e.stopPropagation()
    setIndice((prev) => (prev === 0 ? lista.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    if (e) e.stopPropagation()
    setIndice((prev) => (prev === lista.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      } else if (tieneMultiples) {
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "ArrowRight") handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [tieneMultiples, lista.length])

  if (lista.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
      />

      {/* Contenido (Imagen y Controles) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 max-w-4xl w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-black border border-white/10 bg-oscuro-950 flex flex-col items-center justify-center"
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition-all backdrop-blur-md border border-white/10 hover:scale-105"
          aria-label="Cerrar vista ampliada"
        >
          <FiX size={22} />
        </button>

        {/* Contador de fotos */}
        {tieneMultiples && (
          <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md text-dorado-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            {indice + 1} de {lista.length}
          </div>
        )}

        {/* Imagen actual con animación sutil */}
        <div className="w-full h-full max-h-[85vh] flex items-center justify-center p-2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={lista[indice]}
              src={lista[indice]}
              alt={`Foto ${indice + 1}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain max-h-[80vh] rounded-xl"
            />
          </AnimatePresence>
        </div>

        {/* Flechas de Navegación */}
        {tieneMultiples && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full transition-all backdrop-blur-md border border-white/10 hover:scale-110 shadow-xl"
              aria-label="Foto anterior"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full transition-all backdrop-blur-md border border-white/10 hover:scale-110 shadow-xl"
              aria-label="Foto siguiente"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Paginador de puntos inferior */}
            <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center items-center gap-2">
              {lista.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIndice(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    indice === idx
                      ? "w-6 h-2.5 bg-naranja-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Ir a foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>,
    document.body
  )
}

export default ImageModal
