import { motion, AnimatePresence } from "framer-motion"
import { FiShoppingBag } from "react-icons/fi"
import { useCarrito } from "../context/useCarrito"
import { config } from "../config/local"

//header

const Header = () => {
  const { cantidadTotal, setCarritoAbierto } = useCarrito()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-oscuro-900/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* logo + nombre */}
        <div className="flex items-center gap-2.5">
          <img
            src={config.logo || "/imagenes/logo/logo.svg"}
            alt={`Logo de ${config.nombreLocal}`}
            className="w-10 h-10 object-contain rounded-full bg-oscuro-800 p-1 border border-white/10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold text-gradient">
            {config.nombreLocal}
          </span>
        </div>

        {/* botón del carrito con badge */}
        <button
          onClick={() => setCarritoAbierto(true)}
          className="relative p-2 rounded-xl bg-glass hover:bg-white/10 transition-all duration-200"
          aria-label="Abrir carrito"
        >
          <FiShoppingBag className="text-2xl text-white" />

          {/* badge cantidad */}
          <AnimatePresence>
            {cantidadTotal > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-white text-black text-xs
                           font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
              >
                {cantidadTotal}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

      </div>
    </header>
  )
}

export default Header
