# 📱 Plantilla Base: Catálogo Digital para Negocios (Pedidos vía WhatsApp)

Plantilla base moderna, ultra rápida y optimizada para dispositivos móviles (Mobile-First). Permite a cualquier comercio o emprendimiento (gastronomía, indumentaria, tecnología, etc.) exhibir su catálogo interactivo, gestionar combos y carritos de compra, y recibir pedidos formateados directamente en su número de **WhatsApp**.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Template-Listo-success?style=for-the-badge)

---

## ⚡ Inicio Rápido

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Crear archivo de configuración local:**
   Copiá el archivo `.env.example` y renombralo como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   > 💡 **Modo Plantilla automático**: Si no configuras una URL de Google Sheets, la aplicación iniciará mostrando un producto de muestra interactivo y un aviso instructivo para el administrador.

---

## 🛠️ Guía Paso a Paso de Configuración

Para poner en marcha esta plantilla para un cliente o nuevo negocio, seguí estos pasos:

### 1. Datos Generales del Negocio (`.env.local`)
Abrí `.env.local` y completá las variables:

```env
# Nombre que se mostrará en el Header, Hero, Footer y título de la pestaña
VITE_NOMBRE_LOCAL="Mosku"

# Descripción y eslogan
VITE_DESCRIPCION_LOCAL="Tu tienda online favorita"
VITE_ESLOGAN="Calidad y estilo en cada detalle"

# Número de WhatsApp receptor de pedidos
# (Con código de país, sin signos '+' ni guiones. Ej: Argentina 5491112345678)
VITE_WHATSAPP_NUMERO="5491112345678"

# Horarios, dirección y redes (opcionales)
VITE_HORARIO="Lun a Sáb · 09:00 a 20:00"
VITE_DIRECCION="Av. Siempre Viva 123"
VITE_INSTAGRAM="https://instagram.com/tu_cuenta"
```

---

### 2. Logo, Favicon y Redes Sociales (SEO)
Podés cambiar la identidad visual fácilmente:

1. **Logo y Favicon por archivo local:**
   - Colocá el archivo de tu logo en `public/imagenes/logo/logo.svg` (o `logo.png`).
   - El sistema actualizará automáticamente el Header, el Hero, el Footer y el Favicon del navegador.
2. **Logo por URL externa:**
   - Si tenés el logo alojado en la nube (ej: Cloudinary, Imgur o web del cliente), podés asignarlo directamente en `.env.local`:
     ```env
     VITE_LOGO_URL="https://miservidor.com/mi-logo.png"
     VITE_FAVICON_URL="https://miservidor.com/mi-favicon.png"
     ```
3. **Foto de Fondo del Local (Background):**
   - Para que de fondo aparezca una foto del local (fachada, interior o ambiente), podés definirla en `.env.local`:
     ```env
     VITE_FONDO_URL="/imagenes/fondo.jpg"
     # O mediante un enlace web:
     # VITE_FONDO_URL="https://miservidor.com/foto-local.jpg"
     ```
   - La foto se procesará automáticamente en escala de grises sutil y difuminada para mantener la estética minimalista y garantizar que el texto y las tarjetas sean 100% legibles.
4. **Ícono de Pantalla de Inicio en iPhone (iOS / Safari):**
   - Safari en iOS requiere obligatoriamente una imagen en formato **PNG** cuadrada (180x180 px o 192x192 px). Si solo se usa SVG, el iPhone mostrará una letra genérica en lugar del logo.
   - Ya está configurado `public/apple-touch-icon.png` y `public/imagenes/logo/logo.png`.
   - Al personalizar el logo de un local, asegurate de guardar también su versión PNG en `public/apple-touch-icon.png` para que al usar "Agregar a pantalla de inicio" en iPhone aparezca el logo del local.
5. **Previsualización en WhatsApp / Redes (Open Graph):**
   - El título, descripción y miniatura se actualizan automáticamente en tiempo de ejecución. También podés personalizar los textos estáticos en [index.html](file:///index.html).

---

### 3. Conectar el Catálogo con Google Sheets

Esta plantilla lee el catálogo en tiempo real desde una planilla de cálculo de Google Sheets publicada como CSV. De esta manera, el dueño del local puede modificar precios, pausar stock o agregar productos sin tocar código.

#### Pasos para vincular Google Sheets:
1. Creá una planilla en Google Sheets con las siguientes columnas en la fila 1:
   - `Categoria_ID`: Identificador de la categoría (ej: `cat-remeras`, `cat-pizzas`).
   - `Categoria_Nombre`: Nombre visible (ej: `Remeras`, `Pizzas`).
   - `Categoria_Emoji`: Emoji representativo (ej: `👕`, `🍕`).
   - `Categoria_Descripcion`: Breve descripción debajo del título.
   - `Producto_ID`: Código único del producto (ej: `rem-01`).
   - `Producto_Nombre`: Nombre del producto.
   - `Producto_Descripcion`: Descripción o ingredientes.
   - `Producto_PrecioBase`: Precio numérico (ej: `15000`).
   - `Producto_Imagen`: Enlace web a la foto del producto o ruta en `/imagenes/productos/...`.
   - `Producto_Disponible`: `SI` o `NO` (si ponés `NO`, el producto se oculta automáticamente).
   - `Variantes`: *(Opcional)* Opciones con precio, separadas por barra (ej: `Chico:1000|Grande:1500`).
2. En Google Sheets, andá a:
   - **Archivo** > **Compartir** > **Publicar en la web**.
   - En formato, seleccioná **Valores separados por comas (.csv)**.
   - Presioná **Publicar** y copiá el enlace generado.
3. Pegá el enlace en tu `.env.local`:
   ```env
   VITE_SHEETS_CSV_URL="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
   ```

---

### 4. Promociones, Combos y Sorteos (`src/config/local.js`)

En [src/config/local.js](file:///src/config/local.js) podés habilitar módulos adicionales según las necesidades del negocio:

- **Descuentos por cantidad (Promos automáticas):**
  ```javascript
  promociones: {
    activa: true,
    categoriaId: "cat-remeras",
    cantidadMinima: 3, // Ej: 3x2 o precio especial llevando 3
    precioPromocionalUnitario: 8000,
    nombrePromoMostrado: "Pack Promo x3"
  }
  ```
- **Banner de Oferta Destacada (Hot Sale):**
  ```javascript
  hotSale: {
    activo: true,
    titulo: "LIQUIDACIÓN DE TEMPORADA",
    descripcion: "Hasta 30% OFF en productos seleccionados.",
    etiqueta: "SOLO POR HOY"
  }
  ```
- **Sorteo con Cuenta Regresiva:**
  ```javascript
  sorteo: {
    activo: true,
    fechaInicio: "2026-12-31T20:00:00",
    premio: "¡Orden de compra por $50.000! 🎁",
    descripcion: "Ingresá tu DNI al confirmar tu pedido para participar."
  }
  ```

---

## 📂 Estructura del Proyecto

```text
├── public/
│   └── imagenes/
│       ├── logo/            # Logo y favicon (logo.svg / logo.png)
│       ├── productos/       # Imágenes locales de productos
│       └── promociones/     # Banners de promociones
├── src/
│   ├── components/          # Componentes modulares de React
│   │   ├── Header.jsx       # Barra de navegación con logo y carrito
│   │   ├── HeroSection.jsx  # Portada con título, eslogan y logo
│   │   ├── CategoryTabs.jsx # Filtros por categoría
│   │   ├── ProductCard.jsx  # Tarjeta de producto y selector
│   │   ├── CartSidebar.jsx  # Carrito lateral deslizable
│   │   └── Footer.jsx       # Pie de página y contacto
│   ├── config/
│   │   └── local.js         # Configuración y fallback central
│   ├── context/
│   │   ├── CatalogoContext.jsx # Proveedor de datos (Sheets o Local)
│   │   └── CarritoContext.jsx  # Lógica del carrito y pedido WhatsApp
│   └── data/
│       ├── menu.js          # Menú de muestra local (fallback)
│       └── menuLoader.js    # Parser de CSV de Google Sheets
├── .env.example             # Ejemplo de variables de entorno
└── index.html               # Punto de entrada HTML y metadatos SEO
```

---

## 🚀 Despliegue en Producción (Vercel / Netlify)

1. Subí tu código a GitHub.
2. Importá el repositorio en **Vercel** o **Netlify**.
3. En la sección **Environment Variables** del hosting, agregá las mismas variables que definiste en `.env.local` (`VITE_NOMBRE_LOCAL`, `VITE_WHATSAPP_NUMERO`, `VITE_SHEETS_CSV_URL`, etc.).
4. ¡Listo! Cada cambio en tu Google Sheets se reflejará automáticamente en la web sin necesidad de volver a compilar.

---

*Plantilla desarrollada para crear catálogos digitales ágiles, escalables y orientados a ventas.*
