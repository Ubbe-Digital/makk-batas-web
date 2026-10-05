# Tareas pendientes

Lo que se decidió dejar fuera de la v1. Plan completo:
https://claude.ai/code/artifact/c9f6888c-6041-4155-a5e6-9b2c5a51936d

## Fase 2: gestión del catálogo por Makk (CMS)

- [ ] **Elegir e integrar el CMS.** Makk necesita gestionar sin ayuda los
      modelos: nombre, descripción, fotos (portadas de cuerpo entero, sin
      marcas de agua), categoría y bordados. Evaluar un CMS basado en Git
      (Keystatic o Decap) que escriba en `src/content/`: cada cambio es un
      commit a `main` y el deploy no cambia. Definir cómo inicia sesión Makk
      (cuenta de GitHub propia o login del CMS).
- [ ] **Agregar personajes nuevos.** Makk planea sumar más personajes, así que
      dar de alta uno debe ser simple y no depender de un desarrollador.
      Decidir si el personaje es solo el nombre del modelo o un dato propio
      (por ejemplo una colección `personajes` a la que apunten los modelos),
      y cómo se nombra cada uno.
- [ ] **Nombres y URLs.** Cambiar el nombre de un modelo no cambia su URL, que
      sale del nombre del archivo (`guerrero-naranja.md` →
      `/catalogo/guerrero-naranja/`). Cambiar la URL rompe los enlaces ya
      compartidos por WhatsApp: el CMS no debería permitirlo, o debería dejar
      una redirección. Revisar también los nombres provisionales actuales
      ("Guerrero naranja", "Gatita rosa", "Aloha azul y rosa"…).

## Fase 3: analítica con Umami

- [ ] **Medir visitas y clics con Umami** (decidido el 2026-10-05). Es simple,
      de código abierto y no usa cookies, así que no hace falta banner. Se
      puede usar su nube o instalar en vps2 (Docker + el Postgres que ya
      existe, publicada con `sitio nuevo <dominio> proxy umami:3000`).
      Verificar planes y precios vigentes al implementar.

Los pedidos se cierran en WhatsApp, así que el sitio nunca ve una venta. La
métrica que importa es **cuántas personas tocan "Consultar precio por WhatsApp"
y en qué modelo**: es la mejor señal de demanda que tendremos.

Qué medir, de más a menos importante:

1. Clics en **Consultar precio por WhatsApp**, por modelo (la "conversión").
2. Visitas por página y por modelo: qué batas miran más.
3. De dónde llegan: Instagram, WhatsApp, Google o directo. Para distinguir
   Instagram, el enlace de la bio debe llevar `?utm_source=instagram`.
4. Clics en **Compartir por WhatsApp** y en el botón flotante.
5. Uso de los filtros del catálogo (categoría y color).

Implementación: un `<script>` de Umami en `src/layouts/Base.astro` y
atributos `data-umami-event` en los botones de WhatsApp, de compartir y en los
filtros (por ejemplo `data-umami-event="consultar-precio"` con
`data-umami-event-modelo="toro-rojo-negro"`), más una nota breve en el sitio
que diga qué se mide.

Otras herramientas evaluadas: Cloudflare Web Analytics (gratis, pero no mide
clics), Google Analytics 4 (demasiado para empezar, usa cookies), Microsoft
Clarity (mapas de calor; complemento opcional más adelante) y Twilio Segment
(reparte datos hacia otras herramientas; no aplica).

## Más adelante (sin fase asignada)

- [ ] **Precios visibles.** En la v1 cada modelo dice "Consultar precio". La
      tabla por talla ya está en `src/data/sitio.ts`; publicarla es poner
      `mostrarPrecios = true`.
- [ ] **Carrito y pago en línea**, si los datos de uso lo justifican.
- [ ] **Cotizador de bordado personalizado.**
- [ ] **Reseñas de clientes.**

## Pendiente de contenido

- [ ] **Logo original** (SVG o PNG transparente): lo envía el diseñador.
      Reemplaza `src/assets/logo.png`, que hoy es un recorte de la foto de
      perfil de Instagram.

## Decisiones

- **Guía de tallas:** no se publica (2026-10-05). Las medidas de las batas
  dependen de características específicas de cada pedido, y Makk asesora a
  cada cliente por WhatsApp.
