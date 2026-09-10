// ============================================================
// CONFIGURACIÓN GENERAL DEL LOCAL / PLANTILLA
// Se carga desde variables de entorno (.env.local o hosting)
// ============================================================

export const config = {
  // Información Básica del Local
  nombreLocal: import.meta.env.VITE_NOMBRE_LOCAL || "Nombre del Local",
  descripcion: import.meta.env.VITE_DESCRIPCION_LOCAL || "Catálogo digital y pedidos online",
  eslogan: import.meta.env.VITE_ESLOGAN || "Los mejores productos a tu alcance",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMERO || "", // Ej: "5491112345678" (con código de país, sin '+' ni guiones)
  direccion: import.meta.env.VITE_DIRECCION || "",
  horario: import.meta.env.VITE_HORARIO || "Consultar horarios",
  instagram: import.meta.env.VITE_INSTAGRAM || "", // Enlace completo o usuario

  // Identidad Visual
  logo: import.meta.env.VITE_LOGO_URL || "/imagenes/logo/logo.svg",
  favicon: import.meta.env.VITE_FAVICON_URL || "/imagenes/logo/logo.svg",
  imagenFondo: import.meta.env.VITE_FONDO_URL || "", // Foto del local (ej: "/imagenes/fondo.jpg" o enlace web)

  // URL pública del CSV de Google Sheets (Archivo > Compartir > Publicar en la web > formato CSV)
  // Si se deja vacío, la aplicación funcionará con el producto de muestra de src/data/menu.js
  sheetsUrl: import.meta.env.VITE_SHEETS_CSV_URL || "",

  // Promociones por cantidad configurables del local
  // true = activa el descuento automático agrupando múltiplos de la cantidad mínima
  promociones: {
    activa: false, // Cambiar a true para activar la promoción automática
    categoriaId: "cat-productos", // ID de la categoría a la que aplica
    cantidadMinima: 6, // Cantidad mínima para aplicar el descuento (ej: media docena, pack)
    precioPromocionalUnitario: 1000, // Precio por unidad al comprar la cantidad mínima o múltiplo
    nombrePromoMostrado: "Precio Promo" // Nombre visible en el ticket/carrito
  },

  // Banner Hot Sale / Oferta destacada temporal
  hotSale: {
    activo: false, // true = muestra el banner superior de oferta
    titulo: "OFERTA POR TIEMPO LIMITADO",
    descripcion: "Aprovechá nuestras promociones exclusivas por tiempo limitado.",
    etiqueta: "TIEMPO LIMITADO"
  },

  // Sorteo / Giveaway
  sorteo: {
    activo: false, // true = activa el bloque de sorteo y countdown
    fechaInicio: "2026-12-31T00:00:00",
    premio: "¡Premio sorpresa! 🎁",
    descripcion: "Hacé tu pedido y participás automáticamente en el sorteo.",
  }
};
