import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { config } from "../config/local"

// Calcula la diferencia entre ahora y la fecha objetivo
function calcularTiempoRestante(fechaObjetivo) {
  const diff = new Date(fechaObjetivo) - new Date()
  if (diff <= 0) return null
  return {
    dias:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  }
}

// Bloque individual del countdown
function BloqueTiempo({ valor, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={valor}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-3xl sm:text-4xl font-black text-white tabular-nums w-14 text-center"
      >
        {String(valor).padStart(2, "0")}
      </motion.div>
      <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{label}</span>
    </div>
  )
}

export default function SorteoSection() {
  const s = config.sorteo
  if (!s?.activo) return null

  const [tiempoRestante, setTiempoRestante] = useState(() =>
    calcularTiempoRestante(s.fechaInicio)
  )

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante(s.fechaInicio))
    }, 1000)
    return () => clearInterval(intervalo)
  }, [s.fechaInicio])

  const sorteoActivo = tiempoRestante === null

  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-2">
      <AnimatePresence mode="wait">
        {sorteoActivo ? (
          /* ── SORTEO ACTIVO ── */
          <motion.div
            key="activo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-2xl border border-naranja-500/30 bg-gradient-to-br from-naranja-500/20 via-oscuro-800 to-oscuro-900 p-6 sm:p-8 text-center shadow-xl shadow-naranja-500/10"
          >
            {/* Glow decorativo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-naranja-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-naranja-700/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-4xl animate-bounce">🎉</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ¡El sorteo ya comenzó!
              </h2>
              <p className="text-dorado-200/80 text-sm sm:text-base max-w-md">
                {s.descripcion}
              </p>
              <div className="mt-2 px-5 py-2 rounded-full bg-naranja-500/20 border border-naranja-500/40 text-dorado-300 font-bold text-sm tracking-wide">
                🎁 Premio: {s.premio}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── COUNTDOWN ── */
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-2xl border border-naranja-500/20 bg-gradient-to-br from-oscuro-950 via-oscuro-900 to-oscuro-800 p-6 sm:p-8 text-center shadow-lg"
          >
            {/* Glow sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-naranja-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <span className="text-3xl">🎟️</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Próximamente · Sorteo
                </h2>
                <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                  el sorteo empieza en
                </p>
              </div>

              {/* Dígitos */}
              <div className="flex items-start gap-3 sm:gap-5 mt-1">
                <BloqueTiempo valor={tiempoRestante.dias}    label="días"     />
                <span className="text-3xl text-white/30 font-light mt-1">:</span>
                <BloqueTiempo valor={tiempoRestante.horas}   label="horas"    />
                <span className="text-3xl text-white/30 font-light mt-1">:</span>
                <BloqueTiempo valor={tiempoRestante.minutos} label="minutos"  />
                <span className="text-3xl text-white/30 font-light mt-1">:</span>
                <BloqueTiempo valor={tiempoRestante.segundos} label="segundos" />
              </div>

              <p className="text-white/50 text-xs mt-1">
                📅 Arranca el <span className="text-white/80 font-semibold">16 de mayo</span> — {s.descripcion}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
