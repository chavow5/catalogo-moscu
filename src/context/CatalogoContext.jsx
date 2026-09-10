import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { config } from "../config/local";
import { cargarCatalogoDesdeSheets } from "../data/menuLoader";
import categoriasDemo from "../data/menu";

const CatalogoContext = createContext();

export function CatalogoProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoDemo, setModoDemo] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    // Si no hay URL configurada, usamos el producto de muestra y activamos aviso de modo demo
    if (!config.sheetsUrl || !config.sheetsUrl.trim()) {
      setCategorias(categoriasDemo);
      setModoDemo(true);
      setCargando(false);
      return;
    }

    try {
      const datos = await cargarCatalogoDesdeSheets(config.sheetsUrl);
      setCategorias(datos);
      setModoDemo(false);
    } catch (err) {
      console.error("Error al cargar catálogo desde Google Sheets:", err);
      setError(err.message || "No se pudo cargar el catálogo.");
      setModoDemo(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const categoriasExtendidas = useMemo(() => {
    if (!categorias || categorias.length === 0) return [];
    return [
      ...categorias,
      {
        id: "cat-todos",
        nombre: "Todos",
        emoji: "🌟",
        descripcion: "Todo nuestro menú en un solo lugar",
        productos: categorias.flatMap((c) =>
          c.productos.map((p) => ({ ...p, categoriaOriginalId: c.id }))
        ),
      },
    ];
  }, [categorias]);

  return (
    <CatalogoContext.Provider
      value={{
        categorias,
        categoriasExtendidas,
        cargando,
        error,
        modoDemo,
        recargar: cargarDatos,
      }}
    >
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  const context = useContext(CatalogoContext);
  if (!context) {
    throw new Error("useCatalogo debe usarse dentro de un CatalogoProvider");
  }
  return context;
}

