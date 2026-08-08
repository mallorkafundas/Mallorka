// Copiá este archivo como `local.config.js` y pegá tu URL de Google Sheets.
// local.config.js está en .gitignore — no se sube al repo.

window.MALLORKA_CONFIG = {
  // URL CSV del sheet (ver instrucciones abajo)
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/1g2NkaXTtC2L81SoWL0G6xAQcSevVWGy4dxFXHMcXYxk/export?format=csv&gid=0",

  // Opcional: número de WhatsApp con código de país, sin + ni espacios
  whatsappNumber: "5491126622513",
};

// ── Cómo armar el Google Sheet ─────────────────────────────────────────────
//
// 1. Creá una hoja con estas columnas en la fila 1 (exactamente así):
//    nombre | categoria | marca | precio | imagen_url | activo
//
// 2. Ejemplos de filas:
//    Olas de Mallorca | Tropical | iPhone | 15900 | https://... | true
//
// 3. Archivo → Compartir → “Cualquier persona con el enlace” → Lector
//
// 4. Para obtener la URL CSV:
//    - Abrí el sheet en el navegador
//    - El ID está en la URL: .../spreadsheets/d/ESTE_ES_EL_ID/edit...
//    - El gid está en la URL del tab: ...#gid=123456789
//    - URL final:
//      https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/export?format=csv&gid=123456789
//
// 5. Probá localmente:
//    npm run dev
//    Abrí http://localhost:3000/Mallorka.dc.html
//
// También podés probar sin local.config.js pasando la URL por query:
//   http://localhost:3000/Mallorka.dc.html?sheet=TU_URL_CSV_ENCODADA
