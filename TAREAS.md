# Tareas pendientes

Lo que se decidió dejar fuera de la v1. Plan completo:
https://claude.ai/code/artifact/c9f6888c-6041-4155-a5e6-9b2c5a51936d

## Fase 2

- [ ] **Edición del catálogo por Makk (CMS).** Makk necesita gestionar sin
      ayuda los modelos: nombre, descripción, fotos (portadas de cuerpo entero,
      sin marcas de agua), categoría y bordados. Evaluar un CMS basado en Git
      (Keystatic o Decap) que escriba en `src/content/`: cada cambio es un
      commit a `main` y el deploy no cambia. Definir cómo inicia sesión Makk
      (cuenta de GitHub propia o login del CMS).
      - Cambiar el **nombre** de un modelo no cambia su URL, que sale del nombre
        del archivo (`guerrero-naranja.md` → `/catalogo/guerrero-naranja/`).
        Cambiar la URL rompe los enlaces ya compartidos por WhatsApp: el CMS no
        debería permitirlo, o debería dejar una redirección.
      - Revisar los nombres provisionales de los modelos de personajes
        ("Guerrero naranja", "Gatita rosa", "Aloha azul y rosa"…).
- [ ] **Analítica.** Medir visitas y clics de forma sencilla, sin banner de
      cookies. Ver la recomendación abajo.
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
- [ ] **Guía de tallas** con medidas en cm (pecho, largo, manga por talla),
      si Makk la tiene. Va en la página "Cómo pedir".

## Analítica: recomendación

Los pedidos se cierran en WhatsApp, así que el sitio nunca ve una venta. La
métrica que importa es **cuántas personas tocan "Consultar precio por WhatsApp"
y en qué modelo**: es la mejor señal de demanda que tendremos.

Qué medir, de más a menos importante:

1. Clics en **Consultar precio por WhatsApp**, por modelo (la "conversión").
2. Visitas por página y por modelo: qué batas miran más.
3. De dónde llegan: Instagram, WhatsApp, Google o directo. Para distinguir
   Instagram, el enlace de la bio debe llevar
   `?utm_source=instagram`.
4. Clics en **Compartir por WhatsApp** y en el botón flotante.
5. Uso de los filtros del catálogo (categoría y color).

Opciones (verificar planes y precios vigentes al implementar):

| Herramienta | Qué es | Veredicto |
| --- | --- | --- |
| **Umami** | Analítica simple y de código abierto, sin cookies, con eventos personalizados | **Recomendada.** Cubre los 5 puntos. Se puede usar su nube o instalar en vps2 (Docker + el Postgres que ya existe, publicada con `sitio nuevo <dominio> proxy umami:3000`) |
| Cloudflare Web Analytics | Contador de visitas gratis y sin cookies | Alternativa mínima: visitas y origen, pero sin eventos de clics, que es lo que más interesa |
| Plausible | Como Umami, muy pulida | Buena, pero de pago en la nube, y pesada de instalar en el VPS |
| Google Analytics 4 | Gratis y muy completa | Demasiado para empezar: interfaz compleja, usa cookies y suma peso a la página |
| Microsoft Clarity | Mapas de calor y grabaciones de sesión, gratis | Complemento opcional más adelante, para ver dónde se traban los clientes |
| Twilio Segment | Plataforma que reparte datos hacia otras herramientas | No aplica: sirve cuando ya hay varias herramientas que alimentar |

Implementación sugerida con Umami: un `<script>` en `src/layouts/Base.astro` y
atributos `data-umami-event` en los botones de WhatsApp, de compartir y en los
filtros (por ejemplo `data-umami-event="consultar-precio"` con
`data-umami-event-modelo="toro-rojo-negro"`). Como Umami no usa cookies ni
datos personales, no hace falta banner; basta con una nota breve en el sitio
que diga qué se mide.
