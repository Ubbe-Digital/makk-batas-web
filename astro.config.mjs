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
  },
});
