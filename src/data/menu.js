// ============================================================
// MENÚ LOCAL DE MUESTRA (FALLBACK)
// Se utiliza cuando no hay una hoja de Google Sheets configurada
// ============================================================

export default [
  {
    id: "cat-muestra",
    nombre: "Productos",
    emoji: "🛍️",
    descripcion: "Catálogo de demostración de la plantilla",
    productos: [
      {
        id: "prod-muestra-01",
        nombre: "Producto de Muestra",
        descripcion: "Este es un producto de demostración. Podés vincular tu Google Sheets para cargar tus productos reales.",
        precioBase: 1000,
        emoji: "✨",
        imagen: "/imagenes/productos/producto-muestra.svg",
        disponible: true
      }
    ]
  }
];

