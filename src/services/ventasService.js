import { config } from "../config/local"

/**
 * Envía los datos del pedido a Google Sheets a través de una Web App de Google Apps Script.
 * Utiliza mode: 'no-cors' para evitar problemas de restricciones de origen en navegadores.
 *
 * @param {Object} pedido - Datos del pedido a registrar
 * @returns {Promise<boolean>} true si se procesó el envío, false si no está configurado o falló
 */
export async function registrarVentaEnSheets(pedido) {
  const url = config.registroVentasUrl

  if (!url || !url.trim()) {
    // Si no está configurada la URL, no hace nada (modo silencioso)
    return false
  }

  try {
    // Enviamos el payload serializado como texto plano para evitar preflight OPTIONS
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(pedido),
    })

    return true
  } catch (error) {
    console.warn("No se pudo registrar la venta automáticamente en Google Sheets:", error)
    return false
  }
}

