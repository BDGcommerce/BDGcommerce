/* ============================================================
   BDGstore — Lógica e dados COMPARTILHADOS entre catálogo e admin.
   Backend: Supabase (Auth + Database + Storage).
============================================================ */

/* ---------- Configuração do Supabase ----------
   Substitua pelos valores reais do seu projeto (veja SETUP.md). */
const SUPABASE_URL = 'https://sjnwzfutmaahzgqpfjxi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IZBhqq8F1kgAfkT8dWY4sA__AvrYSBt';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* WhatsApp oficial da BDGstore */
const WHATSAPP = '55996922568';

/* Ícone oficial do WhatsApp (SVG) */
const WHATS_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="flex:none"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.973-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;

/* Ícone de sacola de compras (SVG) */
const BAG_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

/* Produtos de exemplo (apenas fallback para o botão de seed do admin) */
const sampleProducts = [
  { name: 'Furadeira de Impacto Bosch 18V-150 C', category: 'Ferramentas', badge: 'Lançamento',
    price: '3.249,00',
    desc: 'Motor brushless para máxima potência e durabilidade. Inclui 2 baterias ProCORE e carregador rápido.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=80' },
  { name: 'Conjunto SMEG Chaleira e Torradeira', category: 'Eletrodomésticos', badge: 'Estilo Retrô',
    price: '2.899,00',
    desc: 'Design icônico dos anos 50 em preto fosco. Chaleira de 1,7L com desligamento automático.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&q=80' }
];

/* ============================================================
   PRODUTOS (Supabase Database)
============================================================ */
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  // Normaliza price_old (banco) -> priceOld (usado na UI)
  return (data || []).map(r => ({ ...r, priceOld: r.price_old }));
}

async function saveProduct(data, editingId = null) {
  if (editingId) {
    const { error } = await supabase.from('products').update(data).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert([data]);
    if (error) throw error;
  }
}

async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

/* ============================================================
   AUTENTICAÇÃO (Supabase Auth)
============================================================ */
async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function adminLogout() {
  await supabase.auth.signOut();
}

async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/* ============================================================
   UPLOAD DE IMAGEM (Supabase Storage)
============================================================ */
async function uploadImage(file) {
  // Redimensiona/comprime antes do upload (lógica existente do admin)
  const resized = await fileToResizedDataURL(file, 900, 0.82);
  // Converte dataURL para Blob
  const res = await fetch(resized);
  const blob = await res.blob();
  const ext = blob.type === 'image/png' ? 'png' : 'jpg';
  const filename = `products/${uid()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(filename, blob, {
    contentType: blob.type,
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
  return data.publicUrl;
}

/* ============================================================
   PREÇOS
============================================================ */
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

/* ============================================================
   UTILIDADES
============================================================ */
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function uid() { return Date.now() + Math.floor(Math.random() * 1000); }

function placeholderImg(name) {
  const txt = encodeURIComponent((name || 'Produto').slice(0, 20));
  return `https://placehold.co/600x600/18202f/2fe07f?text=${txt}`;
}

function whatsLink(product) {
  const num = WHATSAPP.replace(/\D/g, '');
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
