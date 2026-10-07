import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un modelo se confecciona a pedido en cualquier talla y en los colores que
// elija el cliente: las fotos son pedidos ya entregados, a modo de ejemplo.
const modelos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modelos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      categoria: reference('categorias'),
      // Color del cuerpo; es el que usa el filtro del catálogo. Se normaliza
      // porque el CMS es texto libre: "Negro" y "negro" serian dos filtros.
      color: z.string().trim().toLowerCase(),
      // Color de cuello, puños y cinturón.
      contraste: z.string().trim().toLowerCase(),
      bordado: z.string(),
      // La primera es la portada.
      fotos: z.array(image()).min(1),
      destacado: z.boolean().default(false),
      // false lo oculta del sitio sin borrarlo.
      disponible: z.boolean().default(true),
      orden: z.number().int().default(100),
    }),
});

const categorias = defineCollection({
  loader: file('./src/content/categorias.json'),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    orden: z.number().int(),
  }),
});

const bordados = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bordados' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      foto: image(),
      donde: z.string(),
      orden: z.number().int(),
    }),
});

// Fotos del carrusel de la portada. Es una sola entrada (principal.md): la
// primera foto tambien es la imagen que sale al compartir el sitio.
const portada = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portada' }),
  schema: ({ image }) => z.object({ fotos: z.array(image()).min(1) }),
});

export const collections = { modelos, categorias, bordados, portada };
