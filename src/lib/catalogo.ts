import { getCollection, type CollectionEntry } from 'astro:content';

export type Modelo = CollectionEntry<'modelos'>;
export type Categoria = CollectionEntry<'categorias'>;

export async function getCategorias(): Promise<Categoria[]> {
  const categorias = await getCollection('categorias');
  return categorias.sort((a, b) => a.data.orden - b.data.orden);
}

/** Modelos visibles, ordenados por categoría y luego por su `orden`. */
export async function getModelos(): Promise<Modelo[]> {
  const ordenCategoria = new Map((await getCategorias()).map((c, i) => [c.id, i]));
  const modelos = await getCollection('modelos', (m) => m.data.disponible);
  return modelos.sort(
    (a, b) =>
      (ordenCategoria.get(a.data.categoria.id) ?? 99) - (ordenCategoria.get(b.data.categoria.id) ?? 99) ||
      a.data.orden - b.data.orden ||
      a.data.nombre.localeCompare(b.data.nombre, 'es'),
  );
}

export function capitalizar(texto: string) {
  return texto.charAt(0).toLocaleUpperCase('es') + texto.slice(1);
}

export function colores(modelo: Modelo) {
  return `${capitalizar(modelo.data.color)} con ${modelo.data.contraste}`;
}

export const destinatarios = [
  { id: 'hombre', nombre: 'Hombre' },
  { id: 'mujer', nombre: 'Mujer' },
] as const;

/** "Hombre", "Mujer" o "Hombre y mujer". */
export function paraQuien(modelo: Modelo) {
  const nombres = destinatarios.filter((d) => modelo.data.para.includes(d.id)).map((d) => d.nombre);
  return capitalizar(nombres.join(' y ').toLocaleLowerCase('es'));
}
