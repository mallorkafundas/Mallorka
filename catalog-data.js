export const DEFAULT_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1g2NkaXTtC2L81SoWL0G6xAQcSevVWGy4dxFXHMcXYxk/export?format=csv&gid=0";

const CATALOG_CACHE_KEY = "mallorka_catalog_v1";


export const PHONE_MODELS = {
  iPhone: ["iPhone 11", "iPhone 12", "iPhone 12 Pro", "iPhone 13", "iPhone 13 Pro", "iPhone 14", "iPhone 14 Pro", "iPhone 15", "iPhone 15 Pro", "iPhone 16", "iPhone 16 Pro", "iPhone 17"],
  Samsung: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy S25", "Galaxy A34", "Galaxy A54", "Galaxy A55"],
  Motorola: ["Moto G30", "Moto G60", "Moto G84", "Moto Edge 30", "Moto Edge 40", "Moto Edge 50"],
  Xiaomi: ["Redmi Note 11", "Redmi Note 12", "Redmi Note 13", "Xiaomi 12", "Xiaomi 13", "Xiaomi 14", "POCO X5"],
};

export const TESTIMONIALS = [
  { text: "Pedí la funda con una foto de mi perro y quedó igual a como la armé en la web. Llegó en tres días.", author: "Carla, Rosario" },
  { text: "Buenísima la herramienta para subir la foto y acomodarla. Elegí mi modelo exacto y encajó perfecto.", author: "Nico, Córdoba" },
  { text: "Compré dos con diseños del catálogo y una personalizada. Las tres se ven excelentes.", author: "Male, Mendoza" },
];

export const FAQS = [
  { q: "¿Cómo hago un pedido?", a: "Elegí un diseño del catálogo o usá el diseñador para subir tu foto. Seleccioná la marca y modelo de tu celular y tocá el botón de WhatsApp. Te confirmamos el pedido y coordinamos el pago y envío." },
  { q: "¿La misma imagen sirve para cualquier celular?", a: "Sí. Los diseños del catálogo son universales: la foto es la misma y nosotros adaptamos la funda al molde de tu marca y modelo (iPhone, Samsung, Motorola o Xiaomi)." },
  { q: "¿No encontrás tu modelo de celular?", a: "Escribinos por WhatsApp indicando la marca y el modelo exacto de tu celular. Muchas veces disponemos del molde aunque no figure en la lista de la web, o te confirmamos si podemos conseguirlo." },
  { q: "¿Cuánto tarda la producción y el envío?", a: "La producción suele demorar entre 2 y 4 días hábiles. Los envíos en CABA y GBA tardan 1 a 2 días extra; al interior del país depende del correo o transporte elegido." },
  { q: "¿Qué formas de pago aceptan?", a: "Mercado Pago, transferencia bancaria y efectivo (retiro o entrega coordinada). Te pasamos todos los datos por WhatsApp al confirmar tu pedido." },
  { q: "¿Qué calidad de imagen necesito para una funda personalizada?", a: "Recomendamos fotos nítidas, bien iluminadas y en alta resolución. Si la imagen no es ideal, te avisamos antes de imprimir para que puedas enviar otra." },
  { q: "¿Hacen cambios o devoluciones?", a: "Si hay un error de impresión o de modelo por nuestra parte, lo resolvemos sin costo. Por tratarse de productos personalizados, no aceptamos devoluciones por cambio de opinión una vez confirmado el diseño." },
];

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (cells[i] || "").trim(); });
    return row;
  });
}

function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

export function isProductActive(value) {
  const v = String(value ?? "true").trim().toLowerCase();
  return v !== "false" && v !== "0" && v !== "no";
}

export function parseProductCategories(categoria) {
  return String(categoria || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function extractDriveFileId(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /[?&]id=([^&]+)/,
  ];
  for (const re of patterns) {
    const m = u.match(re);
    if (m) return m[1];
  }
  return "";
}

export function getDriveImageFallbacks(url) {
  const fileId = extractDriveFileId(url);
  if (!fileId) {
    const u = String(url || "").trim();
    return u ? [u] : [];
  }
  return [
    "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000",
    "https://drive.google.com/uc?export=view&id=" + fileId,
    "https://lh3.googleusercontent.com/d/" + fileId + "=w1000",
  ];
}

export function normalizeImageUrl(url) {
  const fallbacks = getDriveImageFallbacks(url);
  return fallbacks[0] || "";
}

export function cacheProducts(products) {
  try {
    sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ at: Date.now(), products }));
  } catch (_) {}
}

export function loadCachedProducts() {
  try {
    const raw = sessionStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.products) || !parsed.products.length) return null;
    if (Date.now() - (parsed.at || 0) > 86400000) return null;
    return parsed.products;
  } catch (_) {
    return null;
  }
}

export function deriveCategoriesFromProducts(products) {
  const names = new Set();
  for (const p of products) {
    for (const c of p.categorias || parseProductCategories(p.categoria)) names.add(c);
  }
  return [...names].sort().map((name, i) => ({ name, hue: i % 2 === 0 ? 25 : 190 }));
}

export async function fetchSheetProducts(csvUrl, retries = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const sep = csvUrl.includes("?") ? "&" : "?";
      const res = await fetch(csvUrl + sep + "_=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo leer el Google Sheet");
      const text = await res.text();
      const products = parseCSV(text)
        .filter((r) => (r.nombre || "").trim() && isProductActive(r.activo))
        .map((r) => {
          const categoria = (r.categoria || "").trim();
          const imagenRaw = (r.imagen_url || "").trim();
          return {
            nombre: (r.nombre || "").trim(),
            categoria,
            categorias: parseProductCategories(categoria),
            marca: (r.marca || "").trim().toLowerCase(),
            precio: Number(String(r.precio).replace(/[^\d.]/g, "")) || 0,
            imagen_url: normalizeImageUrl(imagenRaw),
            imagen_raw: imagenRaw,
            activo: r.activo || "true",
            destacado: (r.destacado || "").trim(),
          };
        });
      if (!products.length) throw new Error("El Google Sheet no tiene productos activos");
      cacheProducts(products);
      return products;
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    }
  }
  const cached = loadCachedProducts();
  if (cached) return cached;
  throw lastError || new Error("No se pudo leer el Google Sheet");
}
