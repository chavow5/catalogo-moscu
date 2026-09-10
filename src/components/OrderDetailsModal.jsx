import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiUser, FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa"

// finaliza el carrito y te preguntan los datos del pedido

const OrderDetailsModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    metodoEntrega: "delivery", // 'delivery' o 'retiro'
    metodoPago: "efectivo", // 'efectivo', 'transferencia'
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validaciones
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onConfirm(formData)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-oscuro-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent">
            <div>
              <h3 className="text-xl font-bold text-white">Finalizar Pedido</h3>
              <p className="text-white/50 text-sm">Completá tus datos para el envío</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <FiX className="text-white/60 text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiUser className="text-white/80" /> Nombre del pedido
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Tu Nombre"
                className={`w-full bg-white/5 border ${errors.nombre ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Método de Entrega */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiMapPin className="text-white/80" /> ¿Cómo recibís tu pedido?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, metodoEntrega: 'delivery' }))}
                  className={`py-3 rounded-xl border transition-all ${formData.metodoEntrega === 'delivery' ? 'bg-white text-black font-bold border-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  🛵 Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, metodoEntrega: 'retiro' }))}
                  className={`py-3 rounded-xl border transition-all ${formData.metodoEntrega === 'retiro' ? 'bg-white text-black font-bold border-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  🏠 Retiro Local
                </button>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiCreditCard className="text-white/80" /> Forma de pago
              </label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
              >
                <option value="efectivo" className="bg-oscuro-900 text-white">Efectivo 💵</option>
                <option value="transferencia" className="bg-oscuro-900 text-white">Transferencia 🏦</option>
              </select>
            </div>


            {/* Botón Enviar */}
            <button
              type="submit"
              className="w-full py-4 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
            >
              <FaWhatsapp size={22} />
              Confirmar y enviar pedido
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default OrderDetailsModal
