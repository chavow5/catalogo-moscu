import { motion } from "framer-motion"
import { FiGift } from "react-icons/fi"

const BannerSorteo = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 mb-8 relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-r from-naranja-500/20 via-oscuro-800 to-oscuro-900 border border-naranja-500/30 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 shadow-[0_0_30px_rgba(135,28,83,0.15)] relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-naranja-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-12 h-12 rounded-full bg-naranja-500/20 flex items-center justify-center shrink-0 border border-naranja-500/30">
          <FiGift className="text-dorado-300 text-2xl" />
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h3 className="text-white font-bold text-lg mb-0.5">¡Participá de nuestro sorteo! 🎉</h3>
          <p className="text-dorado-200/80 text-sm leading-relaxed">
            Con cada pedido tenés chances de ganar. Al finalizar tu compra, <span className="text-dorado-300 font-semibold underline decoration-naranja-400/50">ingresá tu DNI en el paso de confirmación</span> y participás automáticamente.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default BannerSorteo
