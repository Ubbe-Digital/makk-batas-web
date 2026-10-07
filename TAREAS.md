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
- [x] **Rotar el token del bot de Telegram** (2026-10-07): el anterior se revocó
      en @BotFather y el vigente está en el secreto `TELEGRAM_BOT_TOKEN`.
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
      botones llevan `data-evento` (enlaces, con un script propio que no frena la
      navegación) o `data-umami-event` (filtros): `consultar-precio` (con el modelo),
      `compartir-whatsapp` y `copiar-enlace` (con el modelo; el enlace copiado lleva
      `utm_source=enlace&utm_medium=compartir`), `whatsapp` (con el origen: cabecera,
      flotante, portada, como-pedir, bordado-personalizado) y
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
  - [x] Cambiar el enlace del perfil de Instagram a
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

## Mejoras de la web (auditoría del 2026-10-07)

- [x] **Contacto fundido con "Cómo pedir"** (2026-10-07). Una sola página
      (`/como-pedir/`: pasos, tallas, confección, pago, envíos y una sección
      "Contacto"); `/contacto/` redirige a esa sección. Los pasos salen de una
      sola lista (`pasosPedido` en `sitio.ts`) y el pie perdió la columna de
      envíos. El menú queda en 3 enlaces.
- [x] **Auditoría con Lighthouse y correcciones del sitio** (PR #24): catálogo
      sin saltos de diseño (CLS 0,21 a 0, rendimiento 82 a 96), accesibilidad
      100 en las tres páginas medidas, contraste AA, puntos del carrusel
      tocables, fuentes precargadas, `robots.txt`, datos estructurados y
      `utm_source=whatsapp` al compartir un modelo.
- [x] (obsoleto tras Pages) **nginx con cabeceras de seguridad** (`infrastructure` #1, aplicado el
      2026-10-07): HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options`,
      `Permissions-Policy` y una CSP, más caché de sesiones TLS (de 0 a 5
      conexiones reutilizadas de 6), `server_tokens off`, `Vary` y
      `/favicon.ico`. Verificado en producción con Chrome: 0 violaciones de la
      CSP en 5 páginas y Umami enviando datos (`gateway.umami.is`, 200).
- [ ] **Subir las fotos originales** (no las reenviadas por WhatsApp): varias
      miden 563 px y el zoom del visor se pixela. Es un tema de contenido.
- [ ] Opcional: **CLS de la portada** (0,094, "bueno" pero justo): el cambio de
      tipografía empuja el carrusel en móvil. Se arregla con la API de fuentes
      de Astro y un fallback ajustado.
- [ ] Opcional: **CDN** (Cloudflare, plan gratis) delante del sitio para acercar
      el contenido a Venezuela y tener brotli y HTTP/3. Implica mover el DNS de
      Namecheap; decidir cuando Umami muestre cuánto tráfico llega y desde dónde.

## Más adelante (sin fase asignada)

- [ ] **Precios visibles.** En la v1 cada modelo dice "Consultar precio" y el
      repo no guarda la tabla de precios (es público). Publicarlos implica
      decidir dónde viven y agregar la tabla por talla al código.
- [ ] **Carrito y pago en línea**, si los datos de uso lo justifican.
- [ ] **Cotizador de bordado personalizado.**
- [ ] **Reseñas de clientes.**
- [ ] **Enlazar cada foto del carrusel de la portada** a un modelo o ponerle un
      texto encima (hoy es solo una imagen).

## Notas de infraestructura

- **Migración a GitHub Pages** (2026-10-07): el sitio sale del VPS. El repo es
  público (historial reescrito para quitar correo personal y precios; repo
  nuevo `makk-batas-web`). Se pierden las cabeceras que ponía nginx (HSTS,
  `X-Frame-Options`, CSP, `Cache-Control` largo para `/_astro/*`): Pages pone su
  propio caché de 10 minutos y no deja cambiarlo. La CSP volvió como
  `<meta http-equiv>` en `Base.astro` (sin `frame-ancestors`).
  `main` está protegido por ruleset y `publicar-contenido.yml` fusiona por PR
  (ver `AGENTS.md`).
- **Ruleset "Proteger main" activo** (2026-10-07) y probado: un commit en `contenido`
  llegó a `main` por PR de `publicar-contenido.yml`.
- **Migración hecha** (2026-10-07): el sitio sirve desde Pages en
  `batas.ubbedigital.com` (CNAME a `ubbe-digital.github.io`).
- [ ] **Revisar la migración y decidir si el VPS se desmantela del todo.**
      Hasta decidirlo, **no borrar** del VPS el vhost de `batas`, `/opt/makk_batas`
      ni `/opt/web_apps/makk-batas*`, y dejar `MAKK-Batas` (repo viejo,
      privado) archivado, **nunca público** (tiene un correo personal y la
      tabla de precios en el historial).
  - [x] Secretos de Telegram en este repo (probados con `probar-telegram.yml`, 2026-10-07).
  - [x] Probar una edición del CMS de punta a punta (`contenido` →
        `publicar-contenido.yml` → `deploy.yml`) y que Makk use el enlace nuevo
        (hecho: ediciones reales de colaboradores publicadas por PR).
  - [x] Archivar `MAKK-Batas` (archivado y privado).
  - [x] Confirmar que Umami registra visitas y eventos desde el dominio.
  - [ ] Decidir si se desmantela el VPS (ver arriba; mientras tanto no se toca).
- [ ] **Quitar el ❌ del CI en los PR del bot.** `ci.yml` corre en los PR que abre
      `publicar-contenido.yml` y termina en fallo sin jobs ni logs. No bloquea
      nada (el check `build` que exige el ruleset lo publica el workflow), pero
      ensucia la lista de Actions. Idea: `if: github.actor != 'github-actions[bot]'`
      en el job (puede no bastar si falla antes de crear jobs).
- [x] **Seguridad del repo** (2026-10-07): secret scanning, push protection y
      Dependabot security updates activados.
- [x] **Ramas:** "Automatically delete head branches" activado (las ramas de los PR
      se borran al fusionar) y ruleset **Proteger contenido** (no se puede borrar
      ni reescribir). `main` y `contenido` son las únicas ramas permanentes.
- [ ] **Subir Astro 7.3.5 → 7.3.7** (PR abierto; `npm audit` sin vulnerabilidades).
- **Volver al VPS** (si Pages no convence): (1) restaurar `deploy.yml` y
  `rollback.yml` desde el commit `df70a2e` (`git checkout df70a2e -- .github/workflows/deploy.yml .github/workflows/rollback.yml`)
  y los secretos `VPS_SSH_*`/`VPS_KNOWN_HOSTS`; (2) en Namecheap, reemplazar el
  CNAME de `batas` por un registro A a `104.237.2.115`; (3) comprobar el vhost
  de nginx con `sitio`; (4) quitar el dominio en Settings > Pages. Si el repo
  sigue siendo público, no hay que subir nada sensible al VPS (el workflow usa
  secretos de Actions). El VPS clona el repo viejo (`MAKK-Batas`): hay que
  apuntarlo a `makk-batas-web` (`git remote set-url origin …` en
  `/opt/makk_batas/app`).
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
