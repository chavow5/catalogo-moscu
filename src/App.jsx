import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CatalogoProvider, useCatalogo } from "./context/CatalogoContext"
import { CarritoProvider } from "./context/CarritoContext"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import CategoryTabs from "./components/CategoryTabs"
import { ProductCard } from "./components/ProductCard"
import CartSidebar from "./components/CartSidebar"
import Footer from "./components/Footer"
import SorteoSection from "./components/SorteoSection"
import BannerHotSale from "./components/BannerHotSale"
import { config } from "./config/local"
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi"

const animGrilla = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

function AppContent() {
  const { categoriasExtendidas, cargando, error, modoDemo, recargar } = useCatalogo()

  const [categoriaActivaId, setCategoriaActivaId] = useState(null)
  const [filtroActivo, setFiltroActivo] = useState("todas")

  // Actualización dinámica de título y metadatos SEO
  useEffect(() => {
    if (config.nombreLocal) {
      document.title = `${config.nombreLocal} | Catálogo Digital`
    }
    const descEl = document.getElementById("dynamic-desc")
    if (descEl && config.descripcion) {
      descEl.setAttribute("content", config.descripcion)
    }
    const ogTitle = document.getElementById("og-title")
    if (ogTitle && config.nombreLocal) {
      ogTitle.setAttribute("content", `${config.nombreLocal} | Catálogo Digital`)
    }
    const ogDesc = document.getElementById("og-desc")
    if (ogDesc && config.descripcion) {
      ogDesc.setAttribute("content", config.descripcion)
    }
    const ogImage = document.getElementById("og-image")
    if (ogImage && config.logo) {
      ogImage.setAttribute("content", config.logo)
    }
    const fav = document.getElementById("dynamic-favicon")
    if (fav && config.favicon) {
      fav.setAttribute("href", config.favicon)
    }
    const appleTitle = document.getElementById("dynamic-apple-title")
    if (appleTitle && config.nombreLocal) {
      appleTitle.setAttribute("content", config.nombreLocal)
    }
    const appleIcon = document.getElementById("dynamic-apple-icon")
    if (appleIcon && config.logo && !config.logo.endsWith('.svg')) {
      appleIcon.setAttribute("href", config.logo)
    }
  }, [])

  // Cuando carguen las categorías, seleccionamos la primera disponible
  useEffect(() => {
    if (categoriasExtendidas.length > 0) {
      if (!categoriaActivaId || !categoriasExtendidas.some((c) => c.id === categoriaActivaId)) {
        setCategoriaActivaId(categoriasExtendidas[0].id)
      }
    }
  }, [categoriasExtendidas, categoriaActivaId])

  // Reseteamos el filtro interno cada vez que cambiamos de categoría
  useEffect(() => {
    setFiltroActivo("todas")
  }, [categoriaActivaId])

  const categoriaActiva = categoriasExtendidas.find((c) => c.id === categoriaActivaId)

  const productosRender = () => {
    if (!categoriaActiva) return []
    const prods = categoriaActiva.productos.filter((p) => p.disponible)

    if (categoriaActiva.filtros && filtroActivo !== "todas") {
      return prods.filter((p) => p.etiquetaFiltro === filtroActivo)
    }

    return prods
  }

  return (
    <>
      {/* Fondo fotográfico dinámico del local (opcional desde configuración) */}
      {config.imagenFondo && (
        <div
          className="fixed inset-0 z-[-1] pointer-events-none bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${config.imagenFondo})`,
            opacity: 0.16,
            filter: "grayscale(100%) blur(1.5px)",
          }}
        />
      )}

      <Header />
      <CartSidebar />

      <main className="min-h-screen">
        <HeroSection />
        <BannerHotSale />
        <SorteoSection />

        <section className="max-w-6xl mx-auto px-4 py-10">
          {cargando ? (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Cargando menú...</h3>
              <p className="text-white/50 text-sm">
                Sincronizando los productos y precios más actualizados.
              </p>
            </div>
          ) : error ? (
            <div className="py-16 max-w-lg mx-auto text-center px-4 bg-oscuro-800/80 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Estamos actualizando nuestra carta
              </h3>
              <p className="text-white/60 text-sm mb-6">
                En este momento estamos sincronizando los precios y productos. ¡Consultanos o hacé tu pedido directamente por WhatsApp!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {config.whatsapp && (
                  <a
                    href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
                      "¡Hola! Quería consultar la carta y hacer un pedido."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    <span>Pedir por WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={recargar}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-oscuro-700 hover:bg-oscuro-600 text-white/80 border border-white/10 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiRefreshCw size={15} />
                  <span>Reintentar</span>
                </button>
              </div>

              {/* Aviso para el dueño / administrador */}
              <div className="mt-8 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 text-left">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <FiAlertCircle size={14} />
                  <span>Aviso para el administrador / dueño:</span>
                </p>
                <p className="text-amber-300/80">
                  Verificá que la hoja de Google Sheets esté publicada en la web como archivo CSV (Archivo &gt; Compartir &gt; Publicar en la web &gt; CSV) y configurada en <code className="bg-black/30 px-1 py-0.5 rounded font-mono">VITE_SHEETS_CSV_URL</code>.
                </p>
                {import.meta.env.DEV && error && (
                  <p className="mt-2 pt-2 border-t border-amber-500/20 text-red-400 font-mono">
                    Detalle técnico: {error}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Aviso para el dueño cuando está en Modo Plantilla / Demo */}
              {modoDemo && (
                <div className="mb-8 p-4 md:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 backdrop-blur-sm shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">ℹ️</span>
                    <div>
                      <h4 className="font-bold text-amber-100 text-base">Modo Plantilla (Producto de Muestra)</h4>
                      <p className="text-sm text-amber-300/80 mt-0.5">
                        Este catálogo está funcionando con datos de muestra locales. Para cargar los productos reales de tu negocio, agregá el enlace de tu Google Sheets (publicado como CSV) en la variable <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono text-amber-100">VITE_SHEETS_CSV_URL</code> del archivo <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono text-amber-100">.env.local</code>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <CategoryTabs
                categorias={categoriasExtendidas}
                categoriaActivaId={categoriaActivaId}
                setCategoriaActivaId={setCategoriaActivaId}
              />

              <AnimatePresence mode="wait">
                {categoriaActiva && (
                  <motion.div
                    key={categoriaActiva.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Cabecera dinámica de la categoría */}
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <span>{categoriaActiva.emoji}</span>
                          <span>{categoriaActiva.nombre}</span>
                        </h2>
                        {categoriaActiva.descripcion && (
                          <p className="text-white/40 text-sm mt-1">
                            {categoriaActiva.descripcion}
                          </p>
                        )}
                      </div>

                      {/* Renderizar Filtros si la categoría los provee */}
                      {categoriaActiva.filtros && categoriaActiva.filtros.length > 0 && (
                        <div className="flex gap-2">
                          {categoriaActiva.filtros.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setFiltroActivo(f.id)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold scrollbar-hide whitespace-nowrap transition-all duration-200 border
                                ${
                                  filtroActivo === f.id
                                    ? "bg-white border-white text-black font-bold"
                                    : "border-white/10 text-white/50 hover:border-white/30"
                                }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Grilla Genérica de Productos */}
                    <motion.div
                      variants={animGrilla}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                      {productosRender().map((producto) => (
                        <ProductCard
                          key={producto.id}
                          producto={producto}
                          categoriaId={producto.categoriaOriginalId || categoriaActiva.id}
                        />
                      ))}

                      {productosRender().length === 0 && (
                        <div className="col-span-full text-center py-10 text-white/30">
                          No hay productos disponibles en esta sección actualmente.
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </section>

        <Footer />
      </main>
    </>
  )
}

export default function App() {
  return (
    <CatalogoProvider>
      <CarritoProvider>
        <AppContent />
      </CarritoProvider>
    </CatalogoProvider>
  )
}
