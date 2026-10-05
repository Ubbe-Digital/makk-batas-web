# Tareas pendientes

Lo que se decidió dejar fuera de la v1. Plan completo:
https://claude.ai/code/artifact/c9f6888c-6041-4155-a5e6-9b2c5a51936d

## Fase 2

- [ ] **Edición del catálogo por Makk (CMS).** Makk necesita subir productos,
      fotos y bordados sin ayuda. Evaluar un CMS basado en Git (Keystatic o Decap)
      que escriba en `src/content/`: cada cambio es un commit a `main` y el deploy
      no cambia. Definir cómo inicia sesión Makk (cuenta de GitHub propia o login
      del CMS).
- [ ] **Precios visibles.** En la v1 cada producto dice "Consultar precio" y el
      precio se cotiza por WhatsApp. Los campos `precios_usd` (por talla) y
      `recargo_usd` ya existen en el esquema; mostrarlos es cambiar las plantillas.
- [ ] **Carrito y pago en línea**, si los datos de uso lo justifican.
- [ ] **Cotizador de bordado personalizado.**
- [ ] **Reseñas de clientes.**
