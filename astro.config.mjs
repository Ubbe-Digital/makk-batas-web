// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { redireccionesDeModelos } from './scripts/redirecciones.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://batas.ubbedigital.com',
  integrations: [sitemap()],
  // URLs viejas de modelos renombrados (se leen del historial de git).
  redirects: redireccionesDeModelos(),
  vite: {
    plugins: [tailwindcss()],
    // Nada en línea (scripts ni imágenes como data:): permite una política de
    // seguridad de contenido (CSP) sin 'unsafe-inline' en script-src.
    build: { assetsInlineLimit: 0 },
  },
});
