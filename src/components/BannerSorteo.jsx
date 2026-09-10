import { motion } from "framer-motion"
import { FiGift } from "react-icons/fi"

const BannerSorteo = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 mb-8 relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-white/10 via-oscuro-800 to-oscuro-900 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <FiGift className="text-white text-2xl" />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h3 className="text-white font-bold text-lg mb-0.5">¡Participá de nuestro sorteo! 🎉</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Con cada pedido tenés chances de ganar. Al finalizar tu compra, <span className="text-white font-semibold underline decoration-white/40">ingresá tu DNI en el paso de confirmación</span> y participás automáticamente.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default BannerSorteo
