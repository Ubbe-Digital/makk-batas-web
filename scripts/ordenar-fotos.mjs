// Ordena las fotos que sube Pages CMS: el panel las deja sueltas en
// src/assets/modelos/ con nombre aleatorio; aca se mueven a la carpeta de su
// modelo (<slug>/01.jpeg, 02.jpeg...) y se reescriben las rutas en los .md.
// Una foto que solo usa un tipo de bordado va a modelos/_bordados/<slug>.<ext>.
// Es idempotente: no hace nada si no hay fotos sueltas.
// Uso: node scripts/ordenar-fotos.mjs [--dry-run]
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

const DRY = process.argv.includes('--dry-run');
const ASSETS = 'src/assets/modelos';
const COLECCIONES = ['modelos', 'bordados']; // modelos primero: son los duenos
// Ruta relativa al .md con el archivo directo en assets/ (sin subcarpeta).
const SUELTA = /\.\.\/\.\.\/assets\/modelos\/([^/\s'"]+\.(?:jpe?g|png|webp))/gi;

const mds = [];
for (const coleccion of COLECCIONES) {
  const dir = `src/content/${coleccion}`;
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
    const ruta = join(dir, f);
    mds.push({ coleccion, slug: basename(f, '.md'), ruta, texto: await readFile(ruta, 'utf8') });
  }
}

// 1. Dueno de cada foto suelta: el primer modelo que la usa o, si no, el primer bordado.
const duenos = new Map();
for (const md of mds) {
  for (const [, archivo] of md.texto.matchAll(SUELTA)) {
    if (!existsSync(join(ASSETS, archivo))) continue; // que lo reporte el build
    if (!duenos.has(archivo)) duenos.set(archivo, md);
  }
}

// 2. Destino de cada una, numerando en el orden en que aparecen en su dueno.
const destinos = new Map();
const siguiente = new Map(); // carpeta -> proximo numero
async function proximoNumero(carpeta) {
  if (!siguiente.has(carpeta)) {
    const nombres = existsSync(carpeta) ? await readdir(carpeta) : [];
    const usados = nombres.map((n) => parseInt(n, 10)).filter(Number.isFinite);
    siguiente.set(carpeta, Math.max(0, ...usados) + 1);
  }
  const n = siguiente.get(carpeta);
  siguiente.set(carpeta, n + 1);
  return String(n).padStart(2, '0');
}

for (const md of mds) {
  for (const [, archivo] of md.texto.matchAll(SUELTA)) {
    if (duenos.get(archivo) !== md || destinos.has(archivo)) continue;
    const ext = extname(archivo).toLowerCase();
    if (md.coleccion === 'modelos') {
      const carpeta = join(ASSETS, md.slug);
      destinos.set(archivo, `${md.slug}/${await proximoNumero(carpeta)}${ext}`);
    } else {
      let nombre = `${md.slug}${ext}`;
      for (let i = 2; existsSync(join(ASSETS, '_bordados', nombre)); i++) {
        nombre = `${md.slug}-${i}${ext}`;
      }
      destinos.set(archivo, `_bordados/${nombre}`);
    }
  }
}

if (destinos.size === 0) {
  console.log('0 foto(s) ordenada(s)');
  process.exit(0);
}

// 3. Mover los archivos y reescribir las rutas en todos los .md que las usan.
for (const [archivo, destino] of destinos) {
  console.log(`${DRY ? '[dry-run] ' : ''}${archivo} -> ${destino}`);
  if (DRY) continue;
  await mkdir(join(ASSETS, destino, '..'), { recursive: true });
  await rename(join(ASSETS, archivo), join(ASSETS, destino));
}
if (!DRY) {
  for (const md of mds) {
    const nuevo = md.texto.replace(SUELTA, (m, archivo) =>
      destinos.has(archivo) ? `../../assets/modelos/${destinos.get(archivo)}` : m,
    );
    if (nuevo !== md.texto) await writeFile(md.ruta, nuevo);
  }
}
console.log(`${destinos.size} foto(s) ordenada(s)`);
