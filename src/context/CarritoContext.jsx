import { createContext, useContext, useState, useCallback } from "react"
import { config } from "../config/local"
import { useCatalogo } from "./CatalogoContext"
import { CarritoContext } from "./useCarrito"

// Contexto global del carrito de compras
//
// Centraliza todo el estado y la lógica del carrito:
// agregar, quitar, cambiar cantidad, vaciar, calcular totales,
// aplicar promociones automáticas y generar el pedido por WhatsApp.

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  let categoriasActuales = []
  try {
    const catalogo = useCatalogo()
    if (catalogo?.categorias) {
      categoriasActuales = catalogo.categorias
    }
  } catch {
    categoriasActuales = []
  }

  const agregarItem = useCallback((producto, cantidad = 1, variante = null) => {
    setItems((prev) => {
      const clave = variante ? `${producto.id}-${variante}` : producto.id
      const existe = prev.find((i) => i.clave === clave)

      if (existe) {
        return prev.map((i) =>
          i.clave === clave ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      }
      return [...prev, { ...producto, clave, variante, cantidad }]
    })
  }, [])

  const quitarItem = useCallback((clave) => {
    setItems((prev) => prev.filter((i) => i.clave !== clave))
  }, [])

  const cambiarCantidad = useCallback((clave, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.clave !== clave))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.clave === clave ? { ...i, cantidad: nuevaCantidad } : i))
      )
    }
  }, [])

  const vaciarCarrito = useCallback(() => setItems([]), [])

  // === LÓGICA DE PROMOCIONES GENÉRICA ===
  let descuentoGeneral = 0
  let infoPromoActivada = null

  const pConf = config.promociones
  if (pConf?.activa) {
    // Buscar cuántos items sueltos hay en el carrito de la categoría promocionada
    const itemsPromo = items.filter((i) => i.categoriaId === pConf.categoriaId && i.tipo !== "combo")
    const cantidadTotalEnPromo = itemsPromo.reduce((acc, i) => acc + i.cantidad, 0)

    const cantPromos = Math.floor(cantidadTotalEnPromo / pConf.cantidadMinima)

    if (cantPromos > 0) {
      let precios = []
      itemsPromo.forEach((item) => {
        for (let i = 0; i < item.cantidad; i++) {
          precios.push(item.precio)
        }
      })

      // Ordenar de mayor a menor para beneficiar al cliente
      precios.sort((a, b) => b - a)

      let precioTotalOriginal = 0
      const unidadesEnPromo = cantPromos * pConf.cantidadMinima
      for (let i = 0; i < unidadesEnPromo; i++) {
        precioTotalOriginal += precios[i] // Las más caras entran en la promo
      }

      // Nuevo precio basado en promo
      const precioConPromo = cantPromos * (pConf.cantidadMinima * pConf.precioPromocionalUnitario)
      descuentoGeneral = precioTotalOriginal - precioConPromo

      infoPromoActivada = {
        nombre: pConf.nombrePromoMostrado,
        unidades: unidadesEnPromo,
        descuento: descuentoGeneral
      }
    }
  }

  // === TOTALES ===
  const subtotalSinDescuento = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const total = subtotalSinDescuento - descuentoGeneral
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)

  // === GENERACIÓN MSG WHATSAPP GENÉRICO ===
  const generarMensajeWsp = useCallback((datosUsuario = {}) => {
    if (items.length === 0) return ""

    const { nombre, metodoEntrega, direccion, metodoPago, dni } = datosUsuario

    let mensaje = `*Nuevo Pedido en ${config.nombreLocal}*\n\n`
    
    if (nombre) mensaje += `*Cliente:* ${nombre}\n`
    if (metodoEntrega) {
      mensaje += `*Entrega:* ${metodoEntrega === "delivery" ? "Delivery" : "Retiro por local"}\n`
    }
    if (metodoPago) {
      const pagoFormatted = metodoPago === "efectivo" ? "Efectivo" : 
                            metodoPago === "transferencia" ? "Transferencia" : "Tarjeta"
      mensaje += `*Pago:* ${pagoFormatted}\n`
    }
    
    mensaje += "\n--- *DETALLE* ---\n\n"

    // Iteramos por las categorías oficiales para mantener el orden y agrupar visualmente
    if (categoriasActuales && categoriasActuales.length > 0) {
      categoriasActuales.forEach((cat) => {
        // Filtramos items del carrito que pertenecen a esta categoría
        const itemsCat = items.filter((i) => i.categoriaId === cat.id)

        if (itemsCat.length > 0) {
          mensaje += `${cat.emoji} *${cat.nombre}:*\n`

          itemsCat.forEach((item) => {
            const subtotalItem = item.precio * item.cantidad
            const varianteStr = item.variante ? ` (${item.variante})` : ""
            mensaje += `  • ${item.nombre}${varianteStr} x${item.cantidad} → $${subtotalItem.toLocaleString("es-AR")}\n`
          })
          mensaje += "\n"
        }
      })
    } else {
      items.forEach((item) => {
        const subtotalItem = item.precio * item.cantidad
        const varianteStr = item.variante ? ` (${item.variante})` : ""
        mensaje += `  • ${item.nombre}${varianteStr} x${item.cantidad} → $${subtotalItem.toLocaleString("es-AR")}\n`
      })
      mensaje += "\n"
    }

    if (infoPromoActivada && infoPromoActivada.descuento > 0) {
      mensaje += `✨ *${infoPromoActivada.nombre} (${infoPromoActivada.unidades}u): -$${infoPromoActivada.descuento.toLocaleString("es-AR")}*\n\n`
    }

    mensaje += `💰 *Total: $${total.toLocaleString("es-AR")}*\n\n`
    
    if (!metodoEntrega) {
      mensaje += `📍 Por favor indicá tu dirección de envío o si retiras en el local. ¡Gracias!`
    }
    
    if (dni && dni.length >= 7) {
      mensaje += `\n\n🎟️ *Participo del sorteo:* Mi DNI es ${dni}`
    }

    return mensaje
  }, [items, total, infoPromoActivada, categoriasActuales])

  const pedirPorWhatsapp = useCallback((datosUsuario) => {
    if (!config.whatsapp) {
      alert("Aviso para el administrador: El número de WhatsApp del local aún no está configurado en la variable VITE_WHATSAPP_NUMERO.")
      return
    }
    const mensaje = generarMensajeWsp(datosUsuario)
    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
  }, [generarMensajeWsp])

  const valor = {
    items,
    total,
    cantidadTotal,
    carritoAbierto,
    setCarritoAbierto,
    agregarItem,
    quitarItem,
    cambiarCantidad,
    vaciarCarrito,
    pedirPorWhatsapp,
    infoPromoActivada // Expuesto para que el UI pueda mostrarlo
  }

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  )
}
