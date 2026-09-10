import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { FiPlus, FiMinus, FiShoppingBag, FiMaximize2, FiList } from "react-icons/fi"
import { useCarrito } from "../context/useCarrito"
import ImageModal from "./ImageModal"
import ComboBuilderModal from "./ComboBuilderModal"

//Componente para mostrar los productos

const animCard = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const ProductCard = ({ producto, categoriaId }) => {
  const { agregarItem } = useCarrito()

  // Si el producto tiene variantes (ej. tamaños) usa un estado para la selección
  const tieneVariantes = producto.variantes && producto.variantes.length > 0
  const [varianteElegida, setVarianteElegida] = useState(
    tieneVariantes ? producto.variantes[0].id : null
  )

  // Si NO tiene variantes (ej. empanadas ), usa un estado para la cantidad
  const [cantidad, setCantidad] = useState(1)

  // Estados para componentes
  const [modalImagenAbierto, setModalImagenAbierto] = useState(false)
  const [modalComboAbierto, setModalComboAbierto] = useState(false)

  const esCombo = producto.tipo === "combo"

  // Determinar el precio basado en si tiene variantes o es precio fijo
  const precioActual = tieneVariantes
    ? producto.variantes.find((v) => v.id === varianteElegida)?.precio
    : producto.precioBase

  // Nombre de la variante para mostrar luego
  const nombreVarianteActual = tieneVariantes
    ? producto.variantes.find((v) => v.id === varianteElegida)?.nombre
    : null

  const handleAgregar = () => {
    if (esCombo) {
      setModalComboAbierto(true)
      return
    }
    // El objeto que guardamos en el carrito con su precio procesado
    const itemCarrito = {
      ...producto,
      precio: precioActual,
      categoriaId
    }

    agregarItem(itemCarrito, tieneVariantes ? 1 : cantidad, nombreVarianteActual)

    const txtVariante = nombreVarianteActual ? `(${nombreVarianteActual})` : ""
    const txtCant = !tieneVariantes && cantidad > 1 ? `x${cantidad}` : ""
    toast.success(`${producto.emoji} ${producto.nombre} ${txtVariante} ${txtCant} al carrito!`)

    // resetear cantidad solo si la usa
    if (!tieneVariantes) setCantidad(1)
  }

  return (
    <motion.div
      variants={animCard}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-glass rounded-2xl p-4 flex flex-col justify-between gap-4 border border-white/5 hover:border-naranja-500/30 transition-colors duration-300 h-full relative"
    >
      {/* Imagen si existe */}
      {producto.imagen && (
        <div
          onClick={() => setModalImagenAbierto(true)}
          className="relative w-full h-40 -mt-4 -mx-4 mb-2 rounded-t-2xl overflow-hidden group cursor-pointer"
          style={{ width: "calc(100% + 2rem)" }}
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FiMaximize2 className="text-white text-3xl drop-shadow-lg" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Cabecera: emoji + textos + posible etiqueta de destacado */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{producto.emoji}</span>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{producto.nombre}</h3>
              <p className="text-white/50 text-xs mt-1">{producto.descripcion}</p>
            </div>
          </div>
          {producto.etiquetaDestacada && (
            <span className="text-[10px] bg-dorado-500/20 text-dorado-400 border border-dorado-500/30 px-2 py-0.5 rounded-full font-bold shrink-0 uppercase tracking-widest ml-2">
              {producto.etiquetaDestacada}
            </span>
          )}
        </div>

        {/* Zona de variantes (si aplica) */}
        {tieneVariantes && (
          <div className="flex gap-2 w-full mt-2">
            {producto.variantes.map((v) => (
              <button
                key={v.id}
                onClick={() => setVarianteElegida(v.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border
                  ${varianteElegida === v.id
                    ? "bg-white border-white text-black font-bold"
                    : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
              >
                {producto.emoji} {v.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Precio y Controles */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">

        {/* Precio Animado */}
        <div>
          <span className="text-naranja-400 font-bold text-lg">
            ${precioActual?.toLocaleString("es-AR")}
            {!tieneVariantes && <span className="text-white/40 text-xs font-normal"> /u</span>}
          </span>
        </div>

        {/* Controles: Cantidad (+/-) solo si NO hay variantes, y botón Agregar */}
        <div className="flex items-center gap-2">
          {!tieneVariantes && !esCombo && (
            <div className="flex items-center gap-1 bg-oscuro-700 rounded-lg px-1.5 py-1">
              <button
                onClick={() => setCantidad((q) => Math.max(1, q - 1))}
                className="text-white/60 hover:text-white p-1"
              >
                <FiMinus size={14} />
              </button>
              <span className="text-white text-sm w-4 text-center font-bold">{cantidad}</span>
              <button
                onClick={() => setCantidad((q) => q + 1)}
                className="text-white/60 hover:text-white p-1"
              >
                <FiPlus size={14} />
              </button>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAgregar}
            className="btn-naranja flex items-center gap-1.5 text-sm !py-2 !px-3.5"
          >
            {esCombo ? (
              <>
                <FiList size={15} />
                Armar Combo
              </>
            ) : (
              <>
                <FiShoppingBag size={15} />
                Agregar
              </>
            )}
          </motion.button>
        </div>

      </div>

      <AnimatePresence>
        {modalImagenAbierto && (
          <ImageModal
            imagen={producto.imagen}
            onClose={() => setModalImagenAbierto(false)}
          />
        )}
        {modalComboAbierto && (
          <ComboBuilderModal
            productoCombo={producto}
            categoriaId={categoriaId}
            onClose={() => setModalComboAbierto(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
