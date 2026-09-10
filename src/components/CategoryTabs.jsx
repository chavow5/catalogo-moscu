import { motion } from "framer-motion"

/*filtro de productos por categorías

 Muestra tabs con las categorías del menú.
 Al hacer clic en uno, se actualiza la categoría 

 Props:
   - categorias: array de objetos { id, nombre, emoji }
   - categoriaActivaId: id de la categoría actualmente seleccionada
   - setCategoriaActivaId: función para cambiar la categoría activa
*/

const CategoryTabs = ({ categorias, categoriaActivaId, setCategoriaActivaId }) => {
  if (!categorias || categorias.length === 0) return null

  return (
    <div className="flex justify-center mb-8 px-4 relative z-20">
      <div className="bg-oscuro-700/50 backdrop-blur-md p-1.5 rounded-2xl flex flex-wrap justify-center gap-1.5 border border-white/10 shadow-xl max-w-full">

        {categorias.map((cat) => {
          const activo = categoriaActivaId === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategoriaActivaId(cat.id)}
              className="relative px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-base transition-all duration-200 whitespace-nowrap"
            >
              {/* underline animado debajo del tab activo */}
              {activo && (
                <motion.div
                  layoutId="tab-activo"
                  className="absolute inset-0 bg-naranja-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* texto del tab */}
              <span className={`relative z-10 flex items-center gap-1.5 transition-colors ${activo ? "text-black font-bold" : "text-white/60 hover:text-white"}`}>
                <span>{cat.emoji}</span>
                <span>{cat.nombre}</span>
              </span>
            </button>
          )
        })}

      </div>
    </div>
  )
}

export default CategoryTabs
