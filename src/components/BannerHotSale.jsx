import { motion, AnimatePresence } from "framer-motion"
import { FiClock, FiPercent } from "react-icons/fi"
import { config } from "../config/local"

const BannerHotSale = () => {
  const hotSale = config.hotSale;

  if (!hotSale?.activo) return null;

  return (
    <AnimatePresence>
      <div className="max-w-4xl mx-auto px-4 mt-8 -mb-4 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 border border-red-400 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 shadow-[0_0_30px_rgba(220,38,38,0.3)] relative overflow-hidden backdrop-blur-md"
        >
          {/* Elementos decorativos */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent transform -skew-x-12" />
          
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/40 shadow-inner">
            <FiPercent className="text-white text-2xl" />
          </div>
          
          <div className="text-center md:text-left flex-1 relative z-10">
            <h3 className="text-white font-black text-xl mb-1 uppercase tracking-wider drop-shadow-md flex items-center justify-center md:justify-start gap-2">
              🔥 {hotSale.titulo || "OFERTA POR TIEMPO LIMITADO"} 🔥
            </h3>
            <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
              {hotSale.descripcion || "Aprovechá nuestras promociones exclusivas."}
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-black/10">
             <FiClock className="text-yellow-300 animate-pulse" />
             <span className="text-white font-bold text-sm tracking-wide">
               {hotSale.etiqueta || "TIEMPO LIMITADO"}
             </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BannerHotSale
