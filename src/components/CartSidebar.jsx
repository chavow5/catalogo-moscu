import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiTrash2, FiPlus, FiMinus } from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa"
import toast from "react-hot-toast"
import { useCarrito } from "../context/useCarrito"
import OrderDetailsModal from "./OrderDetailsModal"

/*
Carrito de Compras
Muestra los productos agregados al carrito
Permite modificar cantidades, eliminar items, vaciar el carrito
y hacer el pedido directamente por WhatsApp.
*/

const CartSidebar = () => {
  const {
    items,
    total,
    carritoAbierto,
    setCarritoAbierto,
    cambiarCantidad,
    quitarItem,
    vaciarCarrito,
    pedirPorWhatsapp,
    infoPromoActivada,
  } = useCarrito()

  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false)

  // Abre el modal de detalles antes de ir a WhatsApp
  const handleAbrirDetalles = () => {
    setMostrarModalDetalles(true)
  }

  // Al confirmar en el modal, se envía por WhatsApp y se cierra todo
  const handleConfirmarPedido = (datosUsuario) => {
    pedirPorWhatsapp(datosUsuario)
    setMostrarModalDetalles(false)
    setCarritoAbierto(false)
    toast.success("¡Pedido registrado! Abriendo WhatsApp...")
  }

  return (
    <>
      <AnimatePresence>
        {carritoAbierto && (
          <>
            {/* overlay oscuro */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCarritoAbierto(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* panel del carrito */}
            <motion.aside
              key="carrito"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-oscuro-900 border-l border-naranja-700/30 z-50 flex flex-col"
            >
              {/* header del carrito */}
              <div className="flex items-center justify-between p-4 border-b border-naranja-700/20">
                <h2 className="text-xl font-bold text-white">🛒 Tu Pedido</h2>
                <button
                  onClick={() => setCarritoAbierto(false)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <FiX className="text-white/60 text-xl" />
                </button>
              </div>

              {/* lista de items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  // carrito vacío
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <span className="text-6xl">🛒</span>
                    <p className="text-white/40 text-sm">Todavía no agregaste ningún producto.<br />¡Explorá el catálogo y armá tu pedido!</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map((item) => {
                      const subtotal = item.precio * item.cantidad

                      return (
                        <motion.div
                          key={item.clave}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-glass rounded-xl p-3 flex items-center gap-3"
                        >
                          {/* emoji */}
                          <span className="text-2xl shrink-0">{item.emoji}</span>

                          {/* info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{item.nombre}</p>
                            {item.variante && (
                              <p className="text-white/40 text-xs capitalize">{item.variante}</p>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-white font-bold text-sm">
                                ${subtotal.toLocaleString("es-AR")}
                              </p>
                              {item.stock !== undefined && item.cantidad >= item.stock && (
                                <span className="text-[10px] text-amber-400/90 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  Máx. stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* controles cantidad */}
                          <div className="flex items-center gap-1 bg-oscuro-700 rounded-lg px-2 py-1">
                            <button
                              onClick={() => cambiarCantidad(item.clave, item.cantidad - 1)}
                              className="text-white/60 hover:text-white p-0.5"
                              aria-label="Disminuir cantidad"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="text-white text-sm w-4 text-center font-semibold">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => cambiarCantidad(item.clave, item.cantidad + 1)}
                              disabled={item.stock !== undefined && item.cantidad >= item.stock}
                              className="text-white/60 hover:text-white p-0.5 disabled:opacity-20 disabled:cursor-not-allowed"
                              aria-label="Aumentar cantidad"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>

                          {/* quitar item */}
                          <button
                            onClick={() => quitarItem(item.clave)}
                            className="text-white/30 hover:text-red-400 transition-colors p-1"
                            aria-label="Eliminar producto"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* footer del carrito */}
              {items.length > 0 && (
                <div className="p-4 border-t border-naranja-700/20 space-y-3">
                  {/* total y descuentos */}
                  <div className="flex flex-col gap-1 mb-2">
                    {infoPromoActivada && infoPromoActivada.descuento > 0 && (
                      <div className="flex justify-between items-center text-green-400 text-sm">
                        <span className="font-semibold">✨ {infoPromoActivada.nombre} ({infoPromoActivada.unidades}u)</span>
                        <span className="font-bold">-${infoPromoActivada.descuento.toLocaleString("es-AR")}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end mt-1">
                      <span className="text-white/60 font-medium pb-1">Total</span>
                      <span className="text-3xl font-black text-gradient leading-none">
                        ${total.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  {/* botón WhatsApp */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAbrirDetalles}
                    className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold
                               flex items-center justify-center gap-2 transition-colors duration-200
                               shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  >
                    <FaWhatsapp size={20} />
                    Hacer pedido por WhatsApp
                  </motion.button>

                  {/* vaciar carrito */}
                  <button
                    onClick={vaciarCarrito}
                    className="w-full text-white/30 text-sm hover:text-white/60 transition-colors py-1"
                  >
                    Vaciar carrito
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <OrderDetailsModal
        isOpen={mostrarModalDetalles}
        onClose={() => setMostrarModalDetalles(false)}
        onConfirm={handleConfirmarPedido}
      />
    </>
  )
}

export default CartSidebar
