# AGENTS.md

Portal y catálogo de batas de baño de **MAKK Creaciones** (Los Teques,
Venezuela). Sitio estático en **Astro 7 + Tailwind 4**, publicado en
https://batas.ubbedigital.com. Plan y decisiones:
https://claude.ai/code/artifact/c9f6888c-6041-4155-a5e6-9b2c5a51936d

## Comandos

```bash
nvm use 22               # Node >= 22.12 (Astro 7)
npm install
npm run dev              # http://localhost:4321 (en segundo plano: astro dev --background)
npm run check            # astro check: tipos y esquemas del contenido
npm run build            # -> dist/
npm run preview          # sirve dist/
```

## Reglas de trabajo

1. **Nunca commitear sobre `main`.** `main` es producción: un push ahí
   despliega. Se trabaja en `feat/<slug>` y se abre un PR; el CI (`ci.yml`)
   compila el sitio y Kevin revisa antes del merge. Única excepción: el
   workflow `publicar-contenido.yml` fusiona la rama `contenido` (donde escribe
   Pages CMS) en `main` cuando el sitio compila; ver "Pages CMS".
2. **No se publican precios** (decisión del 2026-10-05). Cada modelo dice
   "Consultar precio" y el precio se da por WhatsApp. **Los precios tampoco van
   en el repo** (es público): ni en el código, ni en los `.md`, ni en los
   mensajes de commit o PR.
3. **Nunca deshagas trabajo ajeno** (`git reset --hard`, `git clean`,
   `git checkout -- .` sobre cambios que no hiciste).

## El catálogo

Un **modelo** es una temática + bordado que se confecciona a pedido en
cualquier talla (2 a XXXL) y en los dos colores que elija el cliente. Las fotos
son pedidos ya entregados.

| Qué | Dónde |
| --- | --- |
| Esquemas (Zod) | `src/content.config.ts` |
| Modelos | `src/content/modelos/<slug>.md` (frontmatter + descripción) |
| Fotos de los modelos | `src/assets/modelos/<slug>/01.jpeg`, `02.jpeg`… (el CMS las sube sueltas y el workflow las ordena). La portada es la primera de `fotos` en el modelo |
| Carrusel de la portada | `src/content/portada/principal.md` (lista `fotos`) y `src/assets/portada/`. La primera foto también es la imagen al compartir `/` y `/catalogo/` |
| Categorías | `src/content/categorias.json` |
| Tipos de bordado | `src/content/bordados/*.md` (reusan fotos de los modelos) |
| Contacto, envíos, pagos y tallas | `src/data/sitio.ts` (también los textos de WhatsApp de la ficha: `mensajeConsulta` y `mensajeCompartir`) |
| Material crudo de Makk | `recursos/` (las fotos de `recursos/Galeria/` no se versionan) |
| Clasificación de las fotos recibidas | `recursos/CATALOGO.md` |

### Agregar un modelo

1. Copiar las fotos a `src/assets/modelos/<slug>/` como `01.jpeg`, `02.jpeg`…
   Si vienen de un celular, reducirlas a 2000 px de lado mayor antes.
2. Crear `src/content/modelos/<slug>.md` copiando uno existente. `categoria`
   debe ser un id de `categorias.json`; `color` es el del cuerpo y alimenta el
   filtro del catálogo; `para` (`hombre`, `mujer` o los dos) alimenta el filtro
   "Para" (si falta, el modelo sale en ambos).
3. `npm run check && npm run build`: una foto que no existe o un campo que
   falta rompe el build, no llega a producción.

`disponible: false` oculta un modelo sin borrarlo; `destacado: true` lo lleva a
"Los más pedidos" en la portada.

### Pages CMS

Makk y los colaboradores gestionan modelos y bordados desde
https://app.pagescms.org (login con GitHub; Kevin los invita al repo). La
configuración está en `.pages.yml` y debe mantenerse alineada con
`src/content.config.ts`.

- El CMS **debe trabajar sobre la rama `contenido`**, no sobre `main`.
- Cada push a `contenido` dispara `publicar-contenido.yml`: fusiona en `main`,
  ordena las fotos, las reduce a 2000 px (`scripts/reducir-fotos.mjs`), corre
  `astro check` y el build, y si todo pasa sube a `main` y lanza el deploy. Si
  falla, `main` no cambia y se abre un issue; además, si el repo tiene los
  secretos `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`, avisa por Telegram al
  grupo de Makk y Kevin (Makk no ve los issues). Sin ellos ese paso no hace nada.
- Las fotos de la portada tienen su propia fuente de media (`portada` en `.pages.yml`, carpeta `src/assets/portada/`); `ordenar-fotos.mjs` no las toca. Cada campo de imagen elige su fuente con `options.media`.
- Pages CMS no puede subir a la carpeta de cada modelo: las fotos caen sueltas
  en `src/assets/modelos/` con nombre aleatorio (`rename: random`).
  `scripts/ordenar-fotos.mjs` (paso del workflow) las mueve a
  `src/assets/modelos/<slug>/01.jpeg`, `02.jpeg`… y corrige las rutas en los
  `.md`; si solo las usa un bordado, van a `modelos/_bordados/<slug>.<ext>`.
  Así el repo queda con una carpeta por modelo sin que Makk lo cuide.
- `main` está protegido con el ruleset **Proteger main** (Settings > Rules):
  exige PR y que pase el check `build`, y bloquea el borrado y el push forzado.
  Kevin (admin) puede fusionar un PR saltándose los requisitos, pero no empujar
  directo. GitHub Actions no puede estar en la lista de excepciones del ruleset,
  por eso `publicar-contenido.yml` fusiona **por PR**: sube una rama
  `publicar/<run>`, abre el PR, publica el estado `build` tras validar (los PR de
  `GITHUB_TOKEN` no corren el CI) y lo fusiona. Requiere la opción "Allow
  GitHub Actions to create and approve pull requests". Si el CMS intenta escribir
  en `main`, GitHub lo rechaza; el enlace directo a la rama evita el error:
  https://app.pagescms.org/ubbe-digital/makk-batas-web/contenido
  (`avisar-cms-en-main.yml` queda como respaldo si el ruleset se desactiva).
- La URL de un modelo es el nombre de su archivo (`<slug>.md` →
  `/catalogo/<slug>/`) y se crea a partir del nombre del modelo. Si se renombra
  el archivo (desde el CMS o con `git mv`), `scripts/redirecciones.mjs` lee el
  renombrado del historial de git y `astro.config.mjs` genera la redirección
  desde la URL vieja: los enlaces ya compartidos siguen funcionando. Requiere
  historial completo (el CI y el deploy lo traen). Al renombrar un modelo,
  renombrar también su carpeta de fotos `src/assets/modelos/<slug>/` y sus
  rutas, para que coincida con lo que crea `ordenar-fotos.mjs`.
- Las redirecciones son páginas con meta-refresh, no un 301: las vistas previas
  de enlaces viejos en WhatsApp no siguen la redirección.

### Analítica (Umami)

`src/layouts/Base.astro` carga el script de Umami solo si `analitica.scriptUrl`
y `analitica.websiteId` (en `src/data/sitio.ts`) tienen valor; vacíos, el sitio
no carga nada. Los eventos se declaran con atributos (ver `TAREAS.md`):

- **Enlaces** (`<a>`): `data-evento="..."` y `data-evento-<dato>="..."`; los
  registra un script de `Base.astro` sin esperar la red. **Nunca**
  `data-umami-event` en un enlace: el rastreador de Umami hace `preventDefault`
  y navega recién cuando termina su petición, y con una red lenta el botón
  parece muerto (WhatsApp tardaba varios segundos en abrir).
- **Botones** que no navegan (los filtros): `data-umami-event` funciona bien.
- Al agregar un botón de WhatsApp nuevo: `data-evento="whatsapp"` y
  `data-evento-origen="..."`.

## Deploy

Sitio en **GitHub Pages**, con dominio propio. Push a `main` (merge de un PR) →
`deploy.yml` → `npm ci` + `npm run build` → `actions/deploy-pages`. En
Settings > Pages la fuente es "GitHub Actions" y el dominio es
`batas.ubbedigital.com`; en Namecheap, `batas` es un CNAME a
`ubbe-digital.github.io`. GitHub emite el certificado HTTPS.

- **Vuelta atrás:** Actions > Deploy > Run workflow, con el SHA de un commit
  bueno en `ref` (recompila ese commit), o revertir el commit en `main`.
- `deploy.yml` ignora solo la documentación por nombre. **No ignorar `**/*.md`**:
  el catálogo es Markdown.
- `<meta name="app-version">` y el pie de página llevan `v<versión> · <sha>`
  (la versión de `package.json` y el commit publicado, de `GITHUB_SHA`; en local
  dice `dev`). El SHA cambia en cada deploy, también con los cambios del CMS.
  Para comprobar qué hay publicado: `curl -s https://batas.ubbedigital.com/ | grep app-version`.
- Pages no deja configurar cabeceras HTTP (caché, CSP, HSTS). HTTPS forzado sí
  se activa en Settings > Pages. La CSP va en un `<meta http-equiv>` de
  `Base.astro` (variable `csp`): solo permite lo propio y Umami. **Al agregar un
  servicio externo** (mapa, video, fuente, otro script) hay que sumarlo ahí, o
  el navegador lo bloquea. Un `<meta>` no admite `frame-ancestors`.
- **El repo es público**: no subir secretos, datos de clientes ni precios. Los
  secretos de Actions (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) viven en
  Settings > Secrets, no en el código.
