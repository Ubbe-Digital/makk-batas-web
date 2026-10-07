// Datos del negocio que se repiten en varias páginas. Fuente: mensaje de
// WhatsApp y bio de Instagram de MAKK (2026-10-05).

export const sitio = {
  nombre: 'MAKK Creaciones',
  lema: 'Tu paz comienza aquí',
  descripcion:
    'Batas de baño hechas a mano en Los Teques, bordadas con el diseño y el nombre que elijas.',
  ubicacion: 'Los Teques, Miranda',
  instagram: 'https://www.instagram.com/makk.creaciones/',
  instagramUsuario: '@makk.creaciones',
  // Formato internacional sin "+", como lo pide wa.me.
  whatsapp: '584143028565',
  telefonos: ['0414-3028565', '0414-1788485'],
  confeccion: '3 días hábiles',
  pagos: ['Pago Móvil', 'efectivo'],
  envioLocal: 'Delivery gratis en Los Altos Mirandinos',
  enviosNacionales: ['MRW', 'Zoom', 'Domesa'],
};

// Analítica con Umami (sin cookies). Mientras falte alguno de los dos datos no
// se carga ningún script. Ambos son públicos: salen del panel de Umami
// (Settings > Websites > Edit > Tracking code).
export const analitica = {
  // Ej.: 'https://analitica.ubbedigital.com/script.js' o 'https://cloud.umami.is/script.js'
  scriptUrl: 'https://cloud.umami.is/script.js',
  websiteId: 'c8ea129f-299e-4445-b346-f14c7ba89615',
};

// Decisión del 2026-10-05: la v1 no publica precios ("Consultar precio").
// Para publicarlos basta con poner true; las páginas ya leen esta tabla.
export const mostrarPrecios = false;

// El precio depende solo de la talla, no del modelo.
export const gruposDeTalla = [
  { nombre: 'Niños', tallas: ['2', '4', '6', '8', '10'], precioUsd: 0 },
  { nombre: 'Juvenil', tallas: ['12', '14', '16'], precioUsd: 0 },
  { nombre: 'Adulto', tallas: ['S', 'M'], precioUsd: 0 },
  { nombre: 'Adulto', tallas: ['L', 'XL'], precioUsd: 0 },
  { nombre: 'Adulto', tallas: ['XXL', 'XXXL'], precioUsd: 0 },
];

export const tallas = gruposDeTalla.flatMap((g) => g.tallas);

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Textos que se mandan por WhatsApp. WhatsApp da formato con *negrita* y
// _cursiva_; se quitan esos caracteres de lo que escribe el cliente para que no
// rompan el formato del mensaje.
const limpio = (texto: string) => texto.replace(/[*_~`]/g, '').trim();

// Consulta de una bata. Pensado para que MAKK lea de un vistazo: el modelo en
// negrita, lo que el cliente completó como lista y el enlace solo en la última
// línea (así WhatsApp arma la vista previa con la foto).
export function mensajeConsulta(
  modelo: { nombre: string; url: string },
  datos: { talla?: string; colores?: string; bordado?: string } = {},
) {
  const detalles = [
    ['Talla', datos.talla],
    ['Colores', datos.colores],
    ['Nombre a bordar', datos.bordado],
  ]
    .map(([etiqueta, valor]) => [etiqueta, limpio(valor ?? '')])
    .filter(([, valor]) => valor)
    .map(([etiqueta, valor]) => `• ${etiqueta}: *${valor}*`);

  return [
    'Hola MAKK, me interesa esta bata:',
    '',
    `*${limpio(modelo.nombre)}*`,
    ...(detalles.length ? ['', ...detalles] : []),
    '',
    '¿Me pueden dar el precio?',
    '',
    modelo.url,
  ].join('\n');
}

// Mensaje para mandarle una bata a otra persona.
export function mensajeCompartir(modelo: { nombre: string; colores: string; url: string }) {
  return [
    `Mira esta bata de ${sitio.nombre}:`,
    '',
    `*${limpio(modelo.nombre)}*`,
    `_${modelo.colores}_`,
    '',
    modelo.url,
  ].join('\n');
}

// Sin número: WhatsApp abre la lista de chats para elegir a quién mandarlo.
export function enlaceCompartirWhatsApp(mensaje: string) {
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}
