// Reduce a 2000 px de lado mayor las fotos de src/assets que lo superen, para
// que las fotos de celular subidas desde el CMS no engorden el repo.
// Es idempotente: solo toca lo que excede el limite. Uso: node scripts/reducir-fotos.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const LIMITE = 2000;
const RAIZ = 'src/assets';

async function* fotos(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) yield* fotos(ruta);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) yield ruta;
  }
}

let reducidas = 0;
for await (const ruta of fotos(RAIZ)) {
  const original = await readFile(ruta);
  // rotate() aplica la orientacion EXIF antes de que sharp la descarte.
  const { width, height } = await sharp(original).rotate().metadata();
  if (Math.max(width, height) <= LIMITE) continue;

  const reducida = await sharp(original)
    .rotate()
    .resize({ width: LIMITE, height: LIMITE, fit: 'inside', withoutEnlargement: true })
    .toBuffer();
  await writeFile(ruta, reducida);
  reducidas++;
  console.log(`reducida: ${ruta} (${width}x${height} -> max ${LIMITE})`);
}
console.log(`${reducidas} foto(s) reducida(s)`);
