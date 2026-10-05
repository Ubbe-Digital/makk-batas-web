# Clasificación de la galería

Revisión de `recursos/Galeria/` (34 fotos, 2026-10-05). Los archivos originales
no se movieron: al cargar el catálogo se copian, optimizados y renombrados, a
`src/content/`.

Nombres de archivo abreviados: `11.42.50 (1)` = `WhatsApp Image 2026-10-05 at 11.42.50 AM (1).jpeg`.

## Lo que muestran las fotos

- **Todas las batas son bicolor:** un color de cuerpo y otro de contraste en
  cuello, puños y cinturón. El modelo de datos lleva `color_cuerpo` y
  `color_contraste`.
- **Son pedidos ya entregados:** casi todas llevan el nombre del cliente
  bordado. Un "producto" del catálogo es un **modelo** (temática + bordado) que
  se hace a pedido en la talla y los colores que elija el cliente; las fotos son
  ejemplos.
- **Categorías:** Personajes, Deportes y Clásicas personalizadas (nombre,
  iniciales o monograma).
- **Tallas** (del mensaje de WhatsApp): Niños 2–10, Juvenil 12–16, Adulto S–XXXL.

## Modelos

| # | Modelo | Categoría | Carpeta | Colores (cuerpo + contraste) | Bordado | Fotos, portada primero |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Chicago Bulls | Deportes | Basketball | negro + rojo | logo Bulls en el pecho, NBA en la manga, "BULLS" en la espalda | `11.43.19 (3)`, `11.42.50 (1)`, `11.43.17 (2)`, `11.43.17 (1)`, `11.43.17` |
| 2 | Fútbol | Deportes | Genericos | gris + verde azulado | balón + iniciales | `11.43.19 (6)`, `11.42.50 (5)`, `11.42.50 (7)` |
| 3 | Goku | Personajes | Dragon Ball | naranja + azul | kanji de Goku + nombre | `11.43.20 (2)`, `11.43.18 (2)`, `11.43.18 (4)` |
| 4 | Capsule Corp | Personajes | Dragon Ball | rosa + lila, cinturón verde | logo Capsule Corp + nombre | `11.43.19 (2)` |
| 5 | Hello Kitty blanca | Personajes | Hello Kitty | blanco + rojo | Hello Kitty + nombre | `11.42.50 (10)` |
| 6 | Hello Kitty rosa palo (adulto) | Personajes | Hello Kitty | rosa palo + blanco | Hello Kitty + nombre | `11.43.20`, `11.42.50` |
| 7 | Hello Kitty rosa | Personajes | Hello Kitty | rosa + blanco | Hello Kitty + nombre | `11.43.20 (3)` |
| 8 | Lilo & Stitch azul | Personajes | Lili y Stitch | azul + rosa | logo Lilo & Stitch en blanco | `11.42.50 (3)`, `11.43.20 (4)` |
| 9 | Lilo & Stitch turquesa | Personajes | Lili y Stitch | turquesa + rosa | logo Lilo & Stitch en fucsia | `11.43.20 (5)` |
| 10 | Spiderman clásico (adulto y niño) | Personajes | Spiderman | azul + rojo | araña en la espalda, ojos en el pecho | `11.43.17` |
| 11 | Spiderman emblema | Personajes | Spiderman | azul claro o azul marino + rojo | emblema de araña + nombre | `11.43.18 (3)`, `11.43.18 (1)`, `11.43.18 (5)` |
| 12 | Mario Bros | Personajes | Genericos | azul + rojo | Mario + nombre | `11.43.19 (1)` |
| 13 | Clásica con emblema | Clásicas | Genericos | vinotinto + beige | emblema + iniciales; una variante con bandera de Portugal | `11.43.19 (4)`, `11.42.50 (4)`, `11.42.50 (2)`, `11.42.50 (6)` |
| 14 | Clásica con iniciales | Clásicas | Genericos | gris oscuro + gris claro | iniciales en cursiva | `11.43.18` |
| 15 | Clásica con nombre turquesa | Clásicas | Genericos | turquesa + rosa | nombre en cursiva | `11.43.19 (5)` |
| 16 | Clásica con nombre fucsia | Clásicas | Genericos | fucsia + blanco | nombre en cursiva | `11.43.20 (1)` |
| 17 | Clásica con monograma | Clásicas | Spiderman | blanco + fucsia | monograma "D" | `11.43.19` |

## Para revisar

- [ ] **Mal ubicadas:** Mario Bros (#12) está en `Genericos` y la clásica
      blanca con monograma (#17) en `Spiderman`. En el catálogo ya van en su
      categoría; mover los archivos es opcional.
- [ ] **Descartadas:** `Hello Kitty/11.42.50 (9)` es una captura de un estado
      de WhatsApp (se ve la interfaz) y repite la Hello Kitty blanca.
      `Spiderman/11.43.17 (1)` es la misma foto de `11.43.17` con otro fondo.
- [ ] **Marca de agua "Pixelcut"** en `Genericos/11.42.50 (4)` y
      `Genericos/11.42.50 (7)`. Si existe la versión sin marca, mejor. Si no, se
      recorta o se usan solo como fotos secundarias.
- [ ] **Resolución:** el máximo es 1280 px (las fotos pasaron por WhatsApp).
      Alcanza para la web, pero no para hacer zoom. Si Makk tiene los
      originales del celular, conviene usarlos para las portadas.
- [ ] **Logo:** `Logo MAKK.jpeg` es una captura de la foto de perfil (tiene el
      ícono del lápiz de editar encima). Hace falta el archivo original, en SVG
      o PNG transparente. Mientras tanto se usan los colores sacados de él:
      verde `#15966F` y crema `#F7EEB5`.
