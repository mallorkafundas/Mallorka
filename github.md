repo: mallorkafundas/Mallorka
branch: main

## Last sync
date: 2026-09-11T23:40:00Z

### Updated in this project
- "Volver a colecciones" ahora sí vuelve al inicio del catálogo en mobile: el scroll se recalcula mientras el contenido cambia de alto y se corrige si el navegador lo desvía
- Al volver a colecciones también se limpia la búsqueda, así se ve la grilla de colecciones y no resultados sueltos
- Al elegir una categoría el scroll hasta los diseños es suave (antes era un salto que en mobile a veces no ocurría)
- `overflow-anchor: none` en html/body para que el anclaje de scroll de Chrome mobile no pelee con el desplazamiento programático

## Screen map
| Pantalla | Archivos del repo |
| --- | --- |
| Landing Mallorka (header, hero, catálogo, diseñador, FAQ, footer) | Mallorka.dc.html, index.html (copia publicada), catalog-data.js, uploads/ |
| Página informativa /info.html (SEO, texto plano) | info.html |
| Lista de modelos por marca | catalog-data.js (PHONE_MODELS) |

## Sync history
- 2026-08-31T23:05:00Z — pedido por WhatsApp, controles del diseñador, /info.html, modelos 2026, sección "Nuestros trabajos"
- 2026-08-30T19:02:00Z — logo nuevo, moldes nuevos, adjunto automático del mockup, limpieza de imágenes
- 2026-08-30T18:28:00Z — primera importación del repo al proyecto
