# Tareas pendientes

Lo que se decidió dejar fuera de la v1. Plan completo:
https://claude.ai/code/artifact/c9f6888c-6041-4155-a5e6-9b2c5a51936d

## Fase 2: gestión del catálogo por Makk (CMS)

- [x] **Elegir e integrar el CMS** (2026-10-05). Pages CMS
      (https://app.pagescms.org), configurado en `.pages.yml`: modelos, tipos
      de bordado y portada. Escribe en la rama `contenido`;
      `publicar-contenido.yml` la fusiona en `main` si el sitio compila, ordena
      las fotos por modelo, las reduce a 2000 px y lanza el deploy. Detalle en
      `AGENTS.md` ("Pages CMS"). Los colaboradores entran por correo, sin
      cuenta de GitHub, y los commits llevan su nombre.
- [x] **Nombres y URLs** (2026-10-06). La URL de cada modelo sigue su nombre y
      al renombrar un archivo se genera sola la redirección desde la URL vieja
      (`scripts/redirecciones.mjs`, a partir del historial de git). Se
      renombraron los 16 modelos cuya URL no coincidía con su nombre.
- [x] **Fotos completas y visor con zoom** (2026-10-06). Las fotos ya no se
      recortan; al tocar una se abre un visor con zoom (PhotoSwipe) y la
      miniatura de la foto visible queda marcada.
- [x] **Portada propia** (2026-10-07). Carrusel de fotos editable desde el
      panel ("Portada"), independiente de los modelos.
- [x] **Personajes nuevos** (decidido 2026-10-07). Todo queda en una sola
      categoría "Personajes" para diferenciarlos de Clásicas y Deportes; el
      personaje es parte del nombre del modelo y no hay colección propia. Si el
      portafolio crece mucho y Makk quiere bajar el nivel de detalle, se puede
      cambiar (por ejemplo una colección `personajes` y un filtro por
      personaje).
- [x] **Avisos por Telegram** (2026-10-07). Si falla una publicación o el CMS
      escribe en `main`, llega un mensaje al canal "Makk Batas" (bot
      `@makk_batas_bot`, secretos `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`).
      Probado con un fallo controlado: `main` quedó intacta, se abrió el issue,
      llegó el aviso y la publicación siguiente lo cerró sola.
- [ ] **Rotar el token del bot de Telegram.** Se pegó en un chat durante la
      configuración: `/revoke` en @BotFather y guardar el nuevo con
      `gh secret set TELEGRAM_BOT_TOKEN`.
- [ ] **Terminar de probar el CMS** (pruebas manuales, sin urgencia). Ya hecho:
      deploy confirmado, contenido de prueba limpiado, colaborador por correo
      probado, app de Pages CMS instalada solo en este repo y resto de
      colaboradores invitados con el enlace directo a `contenido`. Falta:
  - [ ] Probar **renombrar un archivo desde el panel** y comprobar que la URL
        vieja redirige (si Pages CMS lo hace como borrar y crear, no habrá
        redirección).
  - [ ] Probar una **foto grande de celular** (~4000 px): que se ordene y se
        reduzca a 2000 px.
  - [ ] Probar **elegir en el campo de un bordado** una foto que ya está en la
        carpeta de un modelo: que la ruta quede bien escrita.
  - [ ] Probar en un **celular real**: deslizar la galería, pellizcar para
        hacer zoom en el visor y deslizar el carrusel de la portada.

## Fase 3: analítica con Umami

- [x] **Código del sitio listo para Umami** (2026-10-07). `Base.astro` carga
      el script solo si `analitica` (en `src/data/sitio.ts`) tiene `scriptUrl` y
      `websiteId`; mide solo el dominio publicado y respeta "No rastrear". Los
      botones llevan `data-umami-event`: `consultar-precio` (con el modelo),
      `compartir-whatsapp` (con el modelo), `whatsapp` (con el origen: cabecera,
      flotante, portada, contacto, como-pedir, bordado-personalizado) y
      `filtro` (con tipo y valor). Con la analítica activa, el pie dice qué se
      mide.
- [x] **Umami activado en la nube** (2026-10-07), plan Hobby gratis: hasta 100
      mil eventos al mes, 1 sitio y 6 meses de datos (el plan Pro, $20/mes, sube
      a 1 millón de eventos, 20 sitios y 2 años; revisar precios si hace falta).
      Si se necesita más capacidad o más sitios, se pasa al vps2: Docker
      (`docker.umami.is/umami-software/umami`) más una base nueva en el Postgres
      existente (solo admite PostgreSQL >= 12.14), publicado con
      `sitio nuevo <dominio> proxy umami:3000` desde el repo `infrastructure` y
      un subdominio nuevo en Namecheap. Los datos de la nube se quedan allá.
- [ ] **Verificar la analítica y usarla.**
  - [ ] Comprobar en Umami que llegan visitas y los eventos (`consultar-precio`,
        `whatsapp`, `compartir-whatsapp`, `filtro`) tras el primer deploy.
  - [ ] Cambiar el enlace del perfil de Instagram a
        `https://batas.ubbedigital.com/?utm_source=instagram` (Umami lo
        registra solo).
  - [ ] En ~2 semanas, revisar qué modelos reciben más "consultar precio".

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
- [ ] **Enlazar cada foto del carrusel de la portada** a un modelo o ponerle un
      texto encima (hoy es solo una imagen).

## Notas de infraestructura

- `main` no se puede proteger: el repo es privado en el plan gratuito de
  GitHub (sin protección de ramas ni rulesets). `avisar-cms-en-main.yml` abre un
  issue si el CMS escribe en `main`. Si el repo pasa a un plan de pago, proteger
  `main` y hacer que `publicar-contenido.yml` fusione por PR.
- **Caché de nginx** (vhost `batas.ubbedigital.com.conf` en `infrastructure`).
  No usa `proxy_cache`: sirve los archivos estáticos desde disco con
  `Cache-Control`. HTML: `max-age=0, must-revalidate` (cada visita revalida con
  ETag y recibe 304 si no cambió, así que un deploy se ve de inmediato).
  `/_astro/*` (CSS, JS y todas las fotos optimizadas, con hash en el nombre):
  `max-age=31536000, immutable`. Compresión gzip para texto; no hay brotli.
- **Mejora posible:** servir las redirecciones de modelos renombrados como 301
  desde nginx en vez de páginas con meta-refresh, para que las vistas previas
  de enlaces viejos en WhatsApp las sigan. Ojo: los navegadores cachean un 301
  por mucho tiempo, así que solo para renombres definitivos.
- El 2026-10-19 `ubuntu-latest` pasa a Ubuntu 26: revisar la primera corrida de
  los workflows después de esa fecha.

## Pendiente de contenido

- [ ] **Logo original** (SVG o PNG transparente): lo envía el diseñador.
      Reemplaza `src/assets/logo.png`, que hoy es un recorte de la foto de
      perfil de Instagram.

## Decisiones

- **Guía de tallas:** no se publica (2026-10-05). Las medidas de las batas
  dependen de características específicas de cada pedido, y Makk asesora a
  cada cliente por WhatsApp.
