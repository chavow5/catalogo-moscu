import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiUser, FiMapPin, FiCreditCard, FiCheck, FiPhone, FiMessageSquare } from "react-icons/fi"
import { FaWhatsapp } from "react-icons/fa"

// finaliza el carrito y te preguntan los datos del pedido

const OrderDetailsModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    metodoEntrega: "delivery", // 'delivery' o 'retiro'
    direccion: "",
    metodoPago: "efectivo", // 'efectivo', 'transferencia'
    notas: "",
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
    if (formData.metodoEntrega === "delivery" && !formData.direccion.trim()) {
      newErrors.direccion = "La dirección de entrega es obligatoria para Delivery"
    }

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
          className="relative w-full max-w-md bg-oscuro-900 border border-naranja-700/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-naranja-700/20 flex justify-between items-center bg-gradient-to-r from-naranja-500/10 to-transparent">
            <div>
              <h3 className="text-xl font-bold text-white">Finalizar Pedido</h3>
              <p className="text-dorado-200/60 text-sm">Completá tus datos para el envío</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <FiX className="text-white/60 text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiUser className="text-naranja-400" /> Nombre del pedido *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Tu Nombre"
                className={`w-full bg-white/5 border ${errors.nombre ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-naranja-500 transition-colors`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiPhone className="text-naranja-400" /> Teléfono de contacto (Opcional)
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 3804-123456"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-naranja-500 transition-colors"
              />
            </div>

            {/* Método de Entrega */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiMapPin className="text-naranja-400" /> ¿Cómo recibís tu pedido?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, metodoEntrega: 'delivery' }))}
                  className={`py-2.5 rounded-xl border transition-all ${formData.metodoEntrega === 'delivery' ? 'bg-gradient-to-r from-naranja-500 to-naranja-600 text-dorado-300 font-bold border-naranja-500 shadow-md shadow-naranja-500/20' : 'bg-white/5 border-white/10 text-white/50 hover:border-naranja-500/30'}`}
                >
                  🛵 Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, metodoEntrega: 'retiro' }))}
                  className={`py-2.5 rounded-xl border transition-all ${formData.metodoEntrega === 'retiro' ? 'bg-gradient-to-r from-naranja-500 to-naranja-600 text-dorado-300 font-bold border-naranja-500 shadow-md shadow-naranja-500/20' : 'bg-white/5 border-white/10 text-white/50 hover:border-naranja-500/30'}`}
                >
                  🏠 Retiro Local
                </button>
              </div>
            </div>

            {/* Dirección de entrega (si es Delivery) */}
            {formData.metodoEntrega === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <FiMapPin className="text-naranja-400" /> Dirección de entrega *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, número, piso/depto, barrio"
                  className={`w-full bg-white/5 border ${errors.direccion ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-naranja-500 transition-colors`}
                />
                {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
              </motion.div>
            )}

            {/* Método de Pago */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiCreditCard className="text-naranja-400" /> Forma de pago
              </label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-naranja-500 transition-colors appearance-none"
              >
                <option value="efectivo" className="bg-oscuro-900 text-white">Efectivo 💵</option>
                <option value="transferencia" className="bg-oscuro-900 text-white">Transferencia 🏦</option>
              </select>
            </div>

            {/* Notas / Aclaraciones */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <FiMessageSquare className="text-naranja-400" /> Notas o aclaraciones (Opcional)
              </label>
              <input
                type="text"
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                placeholder="Ej: Timbre blanco, entregar después de las 18hs"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-naranja-500 transition-colors"
              />
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
            >
              <FaWhatsapp size={20} />
              Confirmar y enviar pedido
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default OrderDetailsModal

