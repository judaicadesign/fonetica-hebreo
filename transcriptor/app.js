// Transcriptor JD · interfaz. Todo corre en el navegador.
import { toGray, inkMap, analyze } from './marks.js';
import { transcribe, toBloc, pointed, letters, skel, refWords } from './align.js';

const CDN = window.JD_TR_CDN || {
  lib: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',
  worker: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
  core: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1',
  lang: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/heb/4.0.0_best_int'
};
const GENERATOR = '../';
const MAX_SIDE = 2600;
const $ = id => document.getElementById(id);

const state = { canvas: null, words: null, lines: null, items: [], sel: -1 };
let workerP = null;

function status(msg, warn = false) { const s = $('status'); s.textContent = msg; s.classList.toggle('warn', warn); }

function loadScript(src) {
  return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('No se pudo cargar ' + src)); document.head.append(s); });
}
async function getWorker() {
  if (!workerP) workerP = (async () => {
    if (!window.Tesseract) await loadScript(CDN.lib);
    const w = await window.Tesseract.createWorker('heb', 1, {
      workerPath: CDN.worker, corePath: CDN.core, langPath: CDN.lang, gzip: true,
      logger: m => { if (m.status === 'recognizing text') status(`Leyendo letras… ${Math.round(m.progress * 100)} %`); }
    });
    await w.setParameters({ tessedit_pageseg_mode: '6', preserve_interword_spaces: '1' });
    return w;
  })().catch(e => { workerP = null; throw e; });
  return workerP;
}

// ---------- imagen ----------
async function setImage(file) {
  if (!file || !/^image\//.test(file.type)) { status('Ese archivo no es una imagen.', true); return; }
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  if (!bmp) { status('No se pudo abrir la imagen. Probá con JPG o PNG.', true); return; }
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  state.canvas = c; state.words = state.lines = null; state.items = [];
  $('dropText').textContent = file.name;
  $('previewWrap').hidden = false; drawPreview();
  $('readBtn').disabled = false; status('Imagen lista. Tocá «Leer imagen».');
  renderAll();
}
function drawPreview() {
  const p = $('preview'), c = state.canvas; p.width = c.width; p.height = c.height;
  const g = p.getContext('2d'); g.drawImage(c, 0, 0);
  for (const x of state.items) if (!x.br && !x.noise) {
    const b = x.W.ocr.b; g.lineWidth = Math.max(2, c.width / 500);
    g.strokeStyle = x.flag && !x.user ? 'rgba(214,160,0,.95)' : 'rgba(38,105,110,.55)';
    g.strokeRect(b.x0 - 3, b.y0 - 3, b.x1 - b.x0 + 6, b.y1 - b.y0 + 6);
  }
}

async function read() {
  if (!state.canvas) return;
  $('readBtn').disabled = true;
  try {
    status('Cargando el lector de letras (la primera vez tarda un poco)…');
    const w = await getWorker();
    const r = await w.recognize(state.canvas, {}, { blocks: true });
    const words = []; let li = 0;
    for (const b of r.data.blocks || []) for (const p of b.paragraphs) for (const l of p.lines) { li++; for (const wd of l.words) words.push({ line: li, t: wd.text, c: Math.round(wd.confidence), b: wd.bbox }); }
    status('Midiendo nikud, meteg, rafe y shevá…');
    await new Promise(r => setTimeout(r, 30));
    const c = state.canvas, data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const ink = inkMap(toGray(data, c.width, c.height), c.width, c.height);
    state.words = words;
    state.lines = analyze(ink, c.width, c.height, words, { squareSheva: $('source').value === 'as-sef' });
    if (!state.lines.length) { status('No encontré renglones de hebreo. Probá con una imagen más nítida o más cerca.', true); return; }
    compare();
    $('sefariaBtn').disabled = false; $('applyRef').disabled = false;
  } catch (e) {
    console.error(e);
    status('No se pudo leer: ' + (e.message || e) + '. Revisá la conexión (el lector se descarga la primera vez).', true);
  } finally { $('readBtn').disabled = false; }
}

function compare() {
  if (!state.lines) return;
  state.items = transcribe(state.lines, $('ref').value.trim());
  const W = state.items.filter(x => !x.br && !x.noise);
  const f = W.filter(x => x.flag).length;
  status(`${W.length} palabras · ${f ? f + ' para revisar' : 'ninguna para revisar'}${$('ref').value.trim() ? '' : ' · sin referencia: las letras no están verificadas'}`, f > 0);
  renderAll();
}

// ---------- resultado ----------
const shown = x => x.user ?? x.text;
function renderAll() {
  const box = $('words'); box.textContent = '';
  const rev = $('review'); rev.textContent = '';
  let prevL = null; let n = 0;
  state.items.forEach((x, i) => {
    if (x.br || x.noise) return;
    if (prevL && x.L !== prevL) box.append(Object.assign(document.createElement('span'), { className: 'br' }));
    prevL = x.L;
    const s = document.createElement('span');
    s.className = 'w' + (x.flag && !x.user ? ' flag' : x.info?.length ? ' info' : '') + (i === state.sel ? ' sel' : '');
    s.textContent = shown(x) + (x.trail || '');
    s.title = [...(x.notes || []), ...(x.info || [])].join(' · ');
    s.onclick = () => select(i);
    box.append(s, ' ');
    if (x.flag && !x.user) { rev.append(reviewItem(x, i)); n++; }
  });
  if (state.canvas) drawPreview();
  updateOutput();
}
function crop(x) {
  const c = state.canvas, b = x.W.ocr.b, bh = x.L.bh;
  const x0 = Math.max(0, b.x0 - bh), x1 = Math.min(c.width, b.x1 + bh), y0 = Math.max(0, x.L.top - 1.2 * bh), y1 = Math.min(c.height, x.L.bot + 1.1 * bh);
  const k = Math.min(3, 520 / (x1 - x0));
  const o = document.createElement('canvas'); o.width = Math.round((x1 - x0) * k); o.height = Math.round((y1 - y0) * k);
  const g = o.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(c, x0, y0, x1 - x0, y1 - y0, 0, 0, o.width, o.height);
  return o;
}
function reviewItem(x, i) {
  const d = document.createElement('div'); d.className = 'rv'; d.id = 'rv' + i;
  const right = document.createElement('div');
  const ul = document.createElement('ul'); for (const t of x.notes) ul.append(Object.assign(document.createElement('li'), { textContent: t }));
  const inp = Object.assign(document.createElement('input'), { value: shown(x), lang: 'he', dir: 'rtl', spellcheck: false });
  inp.setAttribute('aria-label', 'Corrección de la palabra');
  const acts = document.createElement('div'); acts.className = 'acts';
  const ok = Object.assign(document.createElement('button'), { type: 'button', textContent: 'Confirmar' });
  ok.onclick = () => { x.user = inp.value.trim(); renderAll(); };
  acts.append(ok);
  if (x.ref) {
    const r = Object.assign(document.createElement('button'), { type: 'button', textContent: 'Usar la referencia' });
    r.onclick = () => { inp.value = pointed(x.ref); };
    acts.append(r);
  }
  const he = Object.assign(document.createElement('div'), { className: 'he', textContent: shown(x) });
  right.append(he, ul, inp, acts);
  d.append(crop(x), right);
  return d;
}
function select(i) {
  state.sel = i; renderAll();
  document.getElementById('rv' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function updateOutput() {
  const items = state.items.map(x => (x.br ? x : { ...x, text: shown(x) }));
  const t = items.length ? toBloc(items, { keepLines: $('keepLines').checked, jd: $('jdForm').checked }) : '';
  $('output').value = t;
  for (const id of ['copyBtn', 'txtBtn', 'toGenerator']) $(id).disabled = !t;
}

// ---------- Sefaria ----------
async function sefaria() {
  const W = state.items.filter(x => !x.br && !x.noise && (x.W.ocr.c ?? 0) >= 75 && letters(x.ocr).length >= 2);
  if (W.length < 3) { status('Hay pocas palabras claras para buscar. Pegá la referencia a mano.', true); return; }
  const q = W.slice(0, 8).map(x => skel(x.ocr).replace(/כ$/, 'ך').replace(/מ$/, 'ם').replace(/נ$/, 'ן').replace(/פ$/, 'ף').replace(/צ$/, 'ץ')).join(' ');
  const box = $('sefariaHits'); box.textContent = 'Buscando en Sefaria…';
  try {
    const r = await fetch('https://www.sefaria.org/api/search-wrapper', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ query: q, type: 'text', field: 'naive_lemmatizer', slop: 10, size: 12 }) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    const hits = (data.hits?.hits || []).map(h => h._source).filter(s => s && (!s.lang || s.lang === 'he'));
    const seen = new Set(); box.textContent = '';
    for (const s of hits) {
      const key = s.ref + '|' + s.version; if (seen.has(key)) continue; seen.add(key);
      const b = document.createElement('button'); b.type = 'button';
      b.innerHTML = '';
      b.append(document.createTextNode(s.heRef || s.ref), Object.assign(document.createElement('small'), { textContent: `${s.ref} · ${s.version || ''}` }));
      b.onclick = () => loadSefaria(s);
      box.append(b);
    }
    if (!seen.size) box.textContent = 'Sefaria no encontró el pasaje. Pegá la referencia a mano.';
  } catch (e) {
    box.textContent = 'No se pudo consultar Sefaria (' + (e.message || e) + '). Pegá la referencia a mano.';
  }
}
async function loadSefaria(s) {
  const box = $('sefariaHits'); box.textContent = 'Trayendo el texto…';
  const parent = s.ref.replace(/[:\s]\d+(-\d+)?$/, '');
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(parent)}${s.version ? '/he/' + encodeURIComponent(s.version) : ''}?context=0&commentary=0`;
  try {
    const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    const flat = v => (Array.isArray(v) ? v.map(flat).join('\n') : String(v || ''));
    const t = flat(d.he).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
    if (!refWords(t).length) throw new Error('sin texto hebreo');
    $('ref').value = t.trim();
    box.textContent = `Referencia: ${d.heRef || parent}${s.version ? ' · ' + s.version : ''}. Revisá que sea el nusaj correcto.`;
    compare();
  } catch (e) { box.textContent = 'No se pudo traer el texto (' + (e.message || e) + '). Pegalo a mano.'; }
}

// ---------- salida ----------
async function copy() {
  try { await navigator.clipboard.writeText($('output').value); status('Texto copiado.'); return true; }
  catch { $('output').select(); document.execCommand?.('copy'); status('Seleccioné el texto: copialo con Ctrl+C.'); return false; }
}
function download() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([$('output').value + '\n'], { type: 'text/plain;charset=utf-8' }));
  a.download = 'transcriptor-jd.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- eventos ----------
$('file').addEventListener('change', e => setImage(e.target.files[0]));
const drop = $('drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); setImage(e.dataTransfer.files[0]); });
document.addEventListener('paste', e => { const f = [...(e.clipboardData?.files || [])].find(f => /^image\//.test(f.type)); if (f) setImage(f); });
$('readBtn').onclick = read;
$('applyRef').onclick = compare;
$('sefariaBtn').onclick = sefaria;
$('source').onchange = () => { if (state.lines) read(); };
$('jdForm').onchange = updateOutput;
$('keepLines').onchange = updateOutput;
$('copyBtn').onclick = copy;
$('txtBtn').onclick = download;
$('toGenerator').onclick = async () => {
  await copy();
  // Dentro del sistema interno, el sistema cambia a la pestaña del generador; fuera, se abre en otra pestaña.
  if (window.parent !== window) { window.parent.postMessage({ type: 'jd-open-tool', tool: 'phonetics' }, '*'); status('Texto copiado: pegalo en el generador.'); }
  else window.open(GENERATOR, '_blank', 'noopener');
};
window.JD_TRANSCRIPTOR = { state, setImage, read, compare }; // pruebas
