import Papa from "papaparse";

/**
 * Descarga y procesa el catálogo directamente desde Google Sheets (publicado como CSV).
 * Actúa como la única fuente de la verdad para asegurar precios y stock actualizados.
 *
 * @param {string} sheetsUrl - URL pública en formato CSV generada por Google Sheets.
 * @returns {Promise<Array>} Lista de categorías con sus respectivos productos.
 */
export async function cargarCatalogoDesdeSheets(sheetsUrl) {
  const urlLimpia = sheetsUrl ? sheetsUrl.trim() : "";

  if (!urlLimpia) {
    throw new Error(
      "No se configuró la URL de Google Sheets. Por favor, publicá tu hoja como CSV y agregá el enlace."
    );
  }

  const response = await fetch(urlLimpia);
  if (!response.ok) {
    throw new Error(
      `No se pudo descargar la planilla de Google Sheets (Código ${response.status}). Verificá que el enlace sea público.`
    );
  }

  const csvText = await response.text();
  if (!csvText || !csvText.trim()) {
    throw new Error(
      "La planilla de Google Sheets está vacía. Agregá tus productos y categorías para visualizarlos."
    );
  }

  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors && errors.length > 0 && (!data || data.length === 0)) {
    throw new Error("El formato del archivo CSV de Google Sheets no es válido.");
  }

  const categoriasMap = new Map();

  // Helper para buscar el valor de una columna admitiendo variaciones de mayúsculas/minúsculas
  const obtenerValor = (fila, posiblesNombres) => {
    for (const nombre of posiblesNombres) {
      if (fila[nombre] !== undefined && fila[nombre] !== null) {
        const val = String(fila[nombre]).trim();
        if (val !== "") return val;
      }
    }
    // Búsqueda insensible a mayúsculas/minúsculas sobre las claves existentes
    const keys = Object.keys(fila);
    for (const nombre of posiblesNombres) {
      const matchKey = keys.find(
        (k) => k.trim().toLowerCase() === nombre.toLowerCase()
      );
      if (matchKey && fila[matchKey] !== undefined && fila[matchKey] !== null) {
        const val = String(fila[matchKey]).trim();
        if (val !== "") return val;
      }
    }
    return "";
  };

  data.forEach((fila, indice) => {
    const rawCatId = obtenerValor(fila, [
      "Categoria_ID",
      "categoria_id",
      "categoriaId",
      "Categoria",
    ]);
    const rawCatNombre = obtenerValor(fila, [
      "Categoria_Nombre",
      "categoria_nombre",
      "Categoria",
    ]);

    // Si no tiene Categoria_ID pero sí Categoria_Nombre, generamos el ID
    const catId =
      rawCatId ||
      (rawCatNombre
        ? `cat-${rawCatNombre.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
        : "");

    const rawProdId = obtenerValor(fila, [
      "Producto_ID",
      "producto_id",
      "productoId",
      "Id",
      "id",
    ]);
    const nombreProd = obtenerValor(fila, [
      "Producto_Nombre",
      "producto_nombre",
      "Nombre",
      "nombre",
    ]);

    // Si no colocaron Producto_ID pero sí tiene nombre, generamos un ID autoincremental
    const prodId = rawProdId || (nombreProd ? `prod-${indice + 1}` : "");

    // Omitir filas completamente vacías o sin nombre de producto ni categoría
    if (!catId || !nombreProd) return;

    // Crear la categoría si todavía no existe en el mapa
    if (!categoriasMap.has(catId)) {
      const rawFiltros = obtenerValor(fila, [
        "Categoria_Filtros",
        "categoria_filtros",
        "Filtros",
      ]);
      const filtros = rawFiltros
        ? rawFiltros.split("|").map((f) => {
            const [id, label] = f.split(":");
            return {
              id: id ? id.trim() : "",
              label: label ? label.trim() : id ? id.trim() : "",
            };
          })
        : undefined;

      categoriasMap.set(catId, {
        id: catId,
        nombre:
          obtenerValor(fila, [
            "Categoria_Nombre",
            "categoria_nombre",
            "Categoria",
          ]) || catId,
        emoji:
          obtenerValor(fila, ["Categoria_Emoji", "categoria_emoji"]) || "🍽️",
        descripcion: obtenerValor(fila, [
          "Categoria_Descripcion",
          "categoria_descripcion",
        ]),
        filtros: filtros && filtros.length > 0 ? filtros : undefined,
        productos: [],
      });
    }

    const categoria = categoriasMap.get(catId);

    // Parsear variantes si existen en el formato "Id:Precio|Id:Precio"
    const rawVariantes = obtenerValor(fila, ["Variantes", "variantes"]);
    const variantes = rawVariantes
      ? rawVariantes.split("|").map((v) => {
          const [id, precio] = v.split(":");
          const precioNum =
            Number(String(precio).replace(/[^0-9.-]+/g, "")) || 0;
          return {
            id: id.trim().toLowerCase(),
            nombre: id.trim(),
            precio: precioNum,
          };
        })
      : undefined;

    // Procesar precio limpiando posibles símbolos de pesos o puntos
    const rawPrecio = obtenerValor(fila, [
      "Producto_PrecioBase",
      "producto_preciobase",
      "Precio",
      "precio",
      "PrecioBase",
    ]);
    const precioBase = rawPrecio
      ? Number(String(rawPrecio).replace(/[^0-9.-]+/g, ""))
      : 0;

    // Procesar disponibilidad (acepta SI, SÍ, TRUE, 1)
    const rawDisponible = obtenerValor(fila, [
      "Producto_Disponible",
      "producto_disponible",
      "Disponible",
      "disponible",
    ]).toUpperCase();
    const disponible =
      rawDisponible === "SI" ||
      rawDisponible === "SÍ" ||
      rawDisponible === "TRUE" ||
      rawDisponible === "1";

    const tipo = obtenerValor(fila, ["Producto_Tipo", "producto_tipo", "Tipo"]);
    const opcionesDe = obtenerValor(fila, [
      "Combo_OpcionesDe",
      "combo_opcionesde",
      "OpcionesDe",
    ]);
    const rawCantCombo = obtenerValor(fila, [
      "Combo_Cantidad",
      "combo_cantidad",
      "CantidadCombo",
    ]);
    const cantidadCombo = rawCantCombo ? Number(rawCantCombo) : undefined;
    const filtroCombo = obtenerValor(fila, [
      "Combo_FiltroEtiqueta",
      "combo_filtroetiqueta",
      "FiltroCombo",
    ]);
    const etiquetaFiltro = obtenerValor(fila, [
      "Filtro_Etiqueta",
      "filtro_etiqueta",
      "EtiquetaFiltro",
    ]);
    const etiquetaDestacada = obtenerValor(fila, [
      "Filtro_Destacado",
      "filtro_destacado",
    ]);

    const rawImagenes = obtenerValor(fila, [
      "Producto_Imagenes",
      "producto_imagenes",
      "Producto_Imagen",
      "producto_imagen",
      "Imagenes",
      "imagenes",
      "Imagen",
      "imagen",
    ]);

    const imagenes = rawImagenes
      ? rawImagenes
          .split("|")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : [];

    const imagenPrincipal = imagenes.length > 0 ? imagenes[0] : undefined;

    const rawStock = obtenerValor(fila, [
      "Producto_Stock",
      "producto_stock",
      "Stock",
      "stock",
    ]);
    const stock =
      rawStock !== "" && !isNaN(Number(rawStock))
        ? Math.max(0, Math.floor(Number(rawStock)))
        : undefined;

    const producto = {
      id: prodId,
      nombre: nombreProd,
      descripcion: obtenerValor(fila, [
        "Producto_Descripcion",
        "producto_descripcion",
        "Descripcion",
      ]),
      precioBase,
      emoji:
        obtenerValor(fila, ["Producto_Emoji", "producto_emoji", "Emoji"]) ||
        categoria.emoji ||
        "🍽️",
      imagen: imagenPrincipal,
      ...(imagenes.length > 0 && { imagenes }),
      ...(stock !== undefined && { stock }),
      disponible,
      ...(tipo && { tipo }),
      ...(opcionesDe && { opcionesDe }),
      ...(cantidadCombo !== undefined && !isNaN(cantidadCombo) && {
        cantidadCombo,
      }),
      ...(filtroCombo && { filtroCombo }),
      ...(etiquetaFiltro && { etiquetaFiltro }),
      ...(etiquetaDestacada && { etiquetaDestacada }),
      ...(variantes && { variantes }),
    };

    categoria.productos.push(producto);
  });

  const categorias = Array.from(categoriasMap.values());
  if (categorias.length === 0) {
    throw new Error(
      "No se encontraron productos válidos en la planilla de Google Sheets."
    );
  }

  return categorias;
}
