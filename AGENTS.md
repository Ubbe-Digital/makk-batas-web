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
   compila el sitio y Kevin revisa antes del merge.
2. **No se publican precios** (decisión del 2026-10-05). Cada modelo dice
   "Consultar precio" y el precio se da por WhatsApp. La tabla por talla ya
   existe en `src/data/sitio.ts`; para publicarla basta `mostrarPrecios = true`.
3. **Personajes sin marcas en los textos.** Los modelos de personajes llevan
   nombres descriptivos ("Guerrero naranja", "Gatita rosa"), no los nombres
   comerciales de los personajes.
4. **Nunca deshagas trabajo ajeno** (`git reset --hard`, `git clean`,
   `git checkout -- .` sobre cambios que no hiciste).

## El catálogo

Un **modelo** es una temática + bordado que se confecciona a pedido en
cualquier talla (2 a XXXL) y en los dos colores que elija el cliente. Las fotos
son pedidos ya entregados.

| Qué | Dónde |
| --- | --- |
| Esquemas (Zod) | `src/content.config.ts` |
| Modelos | `src/content/modelos/<slug>.md` (frontmatter + descripción) |
| Fotos de los modelos | `src/assets/modelos/<slug>/01.jpeg`, `02.jpeg`… (la 01 es la portada) |
| Categorías | `src/content/categorias.json` |
| Tipos de bordado | `src/content/bordados/*.md` (reusan fotos de los modelos) |
| Contacto, envíos, pagos, tallas y precios | `src/data/sitio.ts` |
| Material crudo de Makk | `recursos/` (las fotos de `recursos/Galeria/` no se versionan) |
| Clasificación de las fotos recibidas | `recursos/CATALOGO.md` |

### Agregar un modelo

1. Copiar las fotos a `src/assets/modelos/<slug>/` como `01.jpeg`, `02.jpeg`…
   Si vienen de un celular, reducirlas a 2000 px de lado mayor antes.
2. Crear `src/content/modelos/<slug>.md` copiando uno existente. `categoria`
   debe ser un id de `categorias.json`; `color` es el del cuerpo y alimenta el
   filtro del catálogo.
3. `npm run check && npm run build`: una foto que no existe o un campo que
   falta rompe el build, no llega a producción.

`disponible: false` oculta un modelo sin borrarlo; `destacado: true` lo lleva a
"Los más pedidos" en la portada.

## Deploy

Push a `main` (merge de un PR) → `deploy.yml` → SSH al VPS como `deploy` →
`git reset --hard origin/main` en `/opt/makk_batas/app` → `npm ci` si cambió el
lock → `npm run build` → `rsync` de `dist/` a `/opt/web_apps/makk-batas` →
`nginx -s reload`. Guarda la versión anterior en
`/opt/web_apps/makk-batas.prev`; el workflow **Rollback** la restaura.

- `deploy.yml` ignora solo la documentación por nombre. **No ignorar `**/*.md`**:
  el catálogo es Markdown.
- `<meta name="app-version">` lleva la versión de `package.json`; sirve para
  comprobar qué hay publicado: `curl -s https://batas.ubbedigital.com/ | grep app-version`.
- El vhost de nginx y el certificado HTTPS se gestionan con `sitio` del repo
  `Ubbe-Digital/infrastructure` (en el VPS: `/opt/base-ci-cd`). Nada de eso vive
  en este repo.
