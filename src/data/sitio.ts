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

// Sin número: WhatsApp abre la lista de chats para elegir a quién mandarlo.
export function enlaceCompartirWhatsApp(mensaje: string) {
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}
