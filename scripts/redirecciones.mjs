// Redirecciones de las URLs viejas de los modelos, sacadas del historial de git.
//
// La URL de un modelo es el nombre de su archivo (`<slug>.md` ->
// `/catalogo/<slug>/`). Si el archivo se renombra, desde el CMS o con git, los
// enlaces ya compartidos por WhatsApp dejarian de funcionar. Cada renombrado
// queda en el historial: aca se leen y se convierten en redirecciones para
// `redirects` de astro.config.mjs. No hay nada que mantener a mano.
//
// Requiere el historial completo: en un clon superficial (--depth) no hay
// renombrados que leer y no se genera ninguna redireccion.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const DIR = 'src/content/modelos';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

export function redireccionesDeModelos() {
  let log;
  try {
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') {
      console.warn('[redirecciones] clon superficial: sin historial no hay redirecciones de modelos renombrados.');
      return {};
    }
    // Del mas viejo al mas nuevo, para encadenar A -> B -> C.
    log = git('log', '--reverse', '--diff-filter=R', '-M50%', '--name-status', '--format=', '--', DIR);
  } catch {
    console.warn('[redirecciones] no se pudo leer el historial de git: sin redirecciones de modelos.');
    return {};
  }

  const destino = new Map(); // id viejo -> id actual
  for (const linea of log.split('\n')) {
    const [estado, viejo, nuevo] = linea.split('\t');
    if (!estado?.startsWith('R') || !viejo?.endsWith('.md') || !nuevo?.endsWith('.md')) continue;
    const de = viejo.slice(DIR.length + 1, -3);
    const a = nuevo.slice(DIR.length + 1, -3);
    for (const [id, actual] of destino) if (actual === de) destino.set(id, a);
    destino.set(de, a);
  }

  const redirects = {};
  for (const [viejo, actual] of destino) {
    const archivo = `${DIR}/${actual}.md`;
    if (viejo === actual || !existsSync(archivo)) continue; // el modelo ya no existe
    if (existsSync(`${DIR}/${viejo}.md`)) continue; // el nombre viejo volvio a usarse
    if (/^disponible:\s*false\s*$/m.test(readFileSync(archivo, 'utf8'))) continue; // oculto
    redirects[`/catalogo/${viejo}`] = `/catalogo/${actual}`;
  }
  return redirects;
}
