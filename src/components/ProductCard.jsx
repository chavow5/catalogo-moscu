import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { FiPlus, FiMinus, FiShoppingBag, FiMaximize2, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi"
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

  // Manejo de múltiples imágenes o imagen única
  const imagenes =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes
      : producto.imagen
      ? [producto.imagen]
      : []
  const [indiceFoto, setIndiceFoto] = useState(0)
  const tieneMultiplesImagenes = imagenes.length > 1

  const handlePrevFoto = (e) => {
    e.stopPropagation()
    setIndiceFoto((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  const handleNextFoto = (e) => {
    e.stopPropagation()
    setIndiceFoto((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  // Si el producto tiene variantes (ej. tamaños) usa un estado para la selección
  const tieneVariantes = producto.variantes && producto.variantes.length > 0
  const [varianteElegida, setVarianteElegida] = useState(
    tieneVariantes ? producto.variantes[0].id : null
  )

  // Manejo de Stock
  const tieneStock = producto.stock !== undefined
  const stockMaximo = tieneStock ? producto.stock : Infinity
  const sinStock = tieneStock && producto.stock <= 0
  const ultimaUnidad = tieneStock && producto.stock === 1

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
    if (sinStock) return

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

    const pudo = agregarItem(itemCarrito, tieneVariantes ? 1 : cantidad, nombreVarianteActual)

    if (pudo) {
      const txtVariante = nombreVarianteActual ? `(${nombreVarianteActual})` : ""
      const txtCant = !tieneVariantes && cantidad > 1 ? `x${cantidad}` : ""
      toast.success(`${producto.emoji} ${producto.nombre} ${txtVariante} ${txtCant} al carrito!`)

      // resetear cantidad solo si la usa
      if (!tieneVariantes) setCantidad(1)
    }
  }

  return (
    <motion.div
      variants={animCard}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`bg-glass rounded-2xl p-4 flex flex-col justify-between gap-4 border transition-all duration-300 h-full relative ${
        sinStock
          ? "opacity-75 border-white/5 grayscale-[30%]"
          : "border-naranja-500/15 hover:border-naranja-500/50 hover:shadow-[0_4px_25px_rgba(135,28,83,0.18)]"
      }`}
    >
      {/* Imágenes / Carrusel si existe */}
      {imagenes.length > 0 && (
        <div
          onClick={() => setModalImagenAbierto(true)}
          className="relative w-full h-44 -mt-4 -mx-4 mb-2 rounded-t-2xl overflow-hidden group cursor-pointer bg-oscuro-900/80 select-none"
          style={{ width: "calc(100% + 2rem)" }}
        >
          <img
            src={imagenes[indiceFoto] || imagenes[0]}
            alt={`${producto.nombre} - imagen ${indiceFoto + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay sutil para hover con icono de zoom */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <FiMaximize2 className="text-dorado-300 text-3xl drop-shadow-lg" />
          </div>

          {/* Badge Sin Stock sobre la imagen */}
          {sinStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-500/90 text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg tracking-wider">
                Agotado
              </span>
            </div>
          )}

          {/* Controles de carrusel si tiene más de 1 imagen */}
          {tieneMultiplesImagenes && (
            <>
              {/* Botón Foto Anterior */}
              <button
                type="button"
                onClick={handlePrevFoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Foto anterior"
              >
                <FiChevronLeft size={18} />
              </button>

              {/* Botón Foto Siguiente */}
              <button
                type="button"
                onClick={handleNextFoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Foto siguiente"
              >
                <FiChevronRight size={18} />
              </button>

              {/* Badge contador */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-dorado-300 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-white/10 shadow">
                {indiceFoto + 1} / {imagenes.length}
              </div>

              {/* Paginación por puntos */}
              <div className="absolute bottom-2 inset-x-0 z-10 flex justify-center items-center gap-1.5 pointer-events-auto">
                {imagenes.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIndiceFoto(idx)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      indiceFoto === idx
                        ? "w-4 bg-naranja-400 shadow-[0_0_6px_rgba(249,115,22,0.8)]"
                        : "w-1.5 bg-white/50 hover:bg-white/90"
                    }`}
                    aria-label={`Ver foto ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Cabecera: emoji + textos + etiquetas limpias */}
        <div className="flex items-start gap-3 w-full">
          <span className="text-3xl shrink-0 mt-0.5">{producto.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-base leading-tight">{producto.nombre}</h3>

              {tieneStock && !sinStock && (
                <span className="text-[10px] bg-white/10 text-dorado-300/90 border border-white/10 px-2 py-0.5 rounded-full font-medium shrink-0">
                  {producto.stock} {producto.stock === 1 ? "disponible" : "disponibles"}
                </span>
              )}

              {sinStock && (
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  Agotado
                </span>
              )}

              {producto.etiquetaDestacada && (
                <span className="text-[10px] bg-naranja-500/20 text-dorado-300 border border-naranja-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shrink-0">
                  {producto.etiquetaDestacada}
                </span>
              )}
            </div>

            <p className="text-dorado-200/60 text-xs mt-1 leading-relaxed">{producto.descripcion}</p>
          </div>
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
                    ? "bg-gradient-to-r from-naranja-500 to-naranja-600 border-naranja-500 text-dorado-300 font-bold shadow-sm"
                    : "border-white/10 text-dorado-200/60 hover:border-naranja-500/40"
                  }`}
              >
                {producto.emoji} {v.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Precio y Controles */}
      <div className="flex items-center justify-between border-t border-naranja-700/20 pt-3 mt-auto">

        {/* Precio Animado */}
        <div>
          <span className="text-naranja-400 font-bold text-lg drop-shadow-sm">
            ${precioActual?.toLocaleString("es-AR")}
            {!tieneVariantes && <span className="text-dorado-200/50 text-xs font-normal"> /u</span>}
          </span>
        </div>

        {/* Controles: Cantidad (+/-) y botón Agregar */}
        <div className="flex items-center gap-2">
          {!tieneVariantes && !esCombo && !sinStock && !ultimaUnidad && (
            <div className="flex items-center gap-1 bg-oscuro-700 rounded-lg px-1.5 py-1">
              <button
                type="button"
                onClick={() => setCantidad((q) => Math.max(1, q - 1))}
                className="text-white/60 hover:text-white p-1"
                aria-label="Reducir cantidad"
              >
                <FiMinus size={14} />
              </button>
              <span className="text-white text-sm w-4 text-center font-bold">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((q) => Math.min(stockMaximo, q + 1))}
                disabled={cantidad >= stockMaximo}
                className="text-white/60 hover:text-white p-1 disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Aumentar cantidad"
              >
                <FiPlus size={14} />
              </button>
            </div>
          )}

          <motion.button
            whileTap={!sinStock ? { scale: 0.9 } : {}}
            onClick={handleAgregar}
            disabled={sinStock}
            className={`flex items-center gap-1.5 text-sm !py-2 !px-3.5 rounded-xl font-bold transition-all ${
              sinStock
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "btn-naranja"
            }`}
          >
            {sinStock ? (
              "Agotado"
            ) : esCombo ? (
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
            imagenes={imagenes}
            indiceInicial={indiceFoto}
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
