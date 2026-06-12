/* ============================================================
   BDGstore — Lógica e dados COMPARTILHADOS entre catálogo e admin.
   Os produtos ficam no localStorage, por isso tudo que é
   cadastrado no admin.html aparece automaticamente no index.html.
============================================================ */

const STORE_KEY = 'bdgstore_products';
const CFG_KEY   = 'bdgstore_config';
const SEED_KEY  = 'bdgstore_seed_v';
const SEED_VERSION = 2; // aumente este número para recarregar os produtos de exemplo

const defaultConfig = {
  whatsapp: '55996922568', // WhatsApp oficial da BDGstore
  password: 'bdg123'
};

const sampleProducts = [
  { id: 1, name: 'Furadeira de Impacto Bosch 18V-150 C', category: 'Ferramentas', badge: 'Lançamento',
    price: '3.249,00',
    desc: 'Motor brushless para máxima potência e durabilidade. Inclui 2 baterias ProCORE e carregador rápido.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=80' },
  { id: 2, name: 'Conjunto SMEG Chaleira e Torradeira', category: 'Eletrodomésticos', badge: 'Estilo Retrô',
    price: '2.899,00',
    desc: 'Design icônico dos anos 50 em preto fosco. Chaleira de 1,7L com desligamento automático.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&q=80' },
  { id: 3, name: 'Kit Catraca Wera Zyklop 1/4"', category: 'Ferramentas', badge: 'Ferramenta Premium',
    price: '849,00',
    desc: 'Inclui catraca Zyklop Speed, soquetes, pontas, extensor e cabo em T.',
    image: 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=700&q=80' },
  { id: 4, name: 'Air Fryer Ninja Dual Zone 7.6L', category: 'Eletrodomésticos', badge: 'Receitas Rápidas',
    price: '2.499,00',
    desc: 'Duas zonas de cozinhar independentes para preparar pratos diferentes ao mesmo tempo. 6 funções de cozinhar.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=700&q=80' },
  { id: 5, name: 'Parafusadeira a Bateria 12V', category: 'Ferramentas', badge: 'Mais Vendido',
    price: '219,90',
    desc: 'Parafusadeira sem fio com 2 baterias, LED e maleta de transporte.',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=700&q=80' },
  { id: 6, name: 'Cafeteira Elétrica 30 Xícaras', category: 'Eletrodomésticos', badge: 'Para o Café',
    price: '159,00',
    desc: 'Cafeteira com jarra de vidro, sistema corta-pingos e aquecimento prolongado.',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=700&q=80' },
  { id: 7, name: 'Caixa Organizadora 50L', category: 'Casa & Utilidades', badge: 'Organização',
    price: '79,90',
    desc: 'Caixa plástica empilhável com tampa e travas, resistente e versátil.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&q=80' },
  { id: 8, name: 'Mangueira de Jardim 20m', category: 'Casa & Utilidades', badge: 'Jardim',
    price: '99,90',
    desc: 'Mangueira flexível com esguicho ajustável e engates rápidos.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80' }
];

// Ícone oficial do WhatsApp (SVG)
const WHATS_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="flex:none"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.973-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;

// Ícone de sacola de compras (SVG)
const BAG_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

/* ---------- Preços ---------- */
function parseMoney(str) {
  if (!str) return 0;
  let s = String(str).replace(/[^\d.,]/g, '');
  if (s.indexOf(',') > -1) s = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
}
function formatMoney(n) {
  return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Armazenamento ---------- */
function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getProducts() { return load(STORE_KEY, []); }
function setProducts(list) { save(STORE_KEY, list); }
function getConfig() { return Object.assign({}, defaultConfig, load(CFG_KEY, {})); }
function setConfig(cfg) { save(CFG_KEY, cfg); }

/* Na primeira visita (ou ao subir a versão), popula com produtos de exemplo */
function seedIfFirstVisit() {
  const v = parseInt(localStorage.getItem(SEED_KEY) || '0', 10);
  if (!localStorage.getItem(STORE_KEY) || v < SEED_VERSION) {
    setProducts(sampleProducts.map(s => Object.assign({}, s, { id: uid() })));
    localStorage.setItem(SEED_KEY, String(SEED_VERSION));
  }
}

/* ---------- Utilidades ---------- */
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function uid() { return Date.now() + Math.floor(Math.random() * 1000); }

function placeholderImg(name) {
  const txt = encodeURIComponent((name || 'Produto').slice(0, 20));
  return `https://placehold.co/600x600/18202f/ffb547?text=${txt}`;
}

function whatsLink(product) {
  const num = (getConfig().whatsapp || '').replace(/\D/g, '');
  let msg = 'Olá, BDGstore! ';
  if (product) {
    msg += `Quero comprar o produto: *${product.name}*`;
    if (product.price) msg += ` — R$ ${product.price} no Pix`;
    msg += '. Pode me ajudar?';
  } else {
    msg += 'Gostaria de mais informações sobre os produtos.';
  }
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
