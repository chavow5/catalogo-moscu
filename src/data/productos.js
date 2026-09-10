// =====================================
// DATOS DEL CATÁLOGO LOCAL (FALLBACK)
// =====================================

import categoriasData from "./menu.js";

export const categorias = categoriasData.map(cat => ({
  ...cat,
  productos: [...cat.productos]
}));

