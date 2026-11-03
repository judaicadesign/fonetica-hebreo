// Transcriptor JD · alineación con un texto de referencia y armado del resultado.
import { renderWord } from './marks.js';

const FIN = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
export const letters = w => (w.match(/[א-ת]/g) || []);
export const skel = w => letters(w).map(c => FIN[c] || c).join('');
// Quita teamim (cantilación) y unifica: la referencia puede traerlos.
export function cleanRef(t) {
  return t.normalize('NFD')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[֑-֯׀׃׆]/g, m => (m === '׀' || m === '׃' ? m : ''))
    .replace(/&[a-z]+;/g, ' ')
    .normalize('NFC');
}
export function refWords(text) {
  return cleanRef(text).split(/[\s־]+/).filter(w => /[א-ת]/.test(w));
}
// nikud de una palabra, sin puntuación
export const pointed = w => w.normalize('NFC').replace(/[^ְ-ׇא-ת]/g, '');

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length; if (!m || !n) return Math.max(m, n);
  let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const q = [i];
    for (let j = 1; j <= n; j++) q[j] = Math.min(p[j] + 1, q[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = q;
  }
  return p[n];
}
export const sim = (a, b) => 1 - lev(a, b) / Math.max(1, a.length, b.length);

// Alineación semiglobal: la referencia puede ser más larga que la imagen (capítulo o rezo completo).
export function alignWords(A, B) { // A: skeletons de la imagen; B: de la referencia
  const n = A.length, m = B.length, GAP = -0.45;
  const S = Array.from({ length: n + 1 }, () => new Float32Array(m + 1));
  const P = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
  for (let i = 1; i <= n; i++) { S[i][0] = S[i - 1][0] + GAP; P[i][0] = 2; }
  for (let j = 1; j <= m; j++) { S[0][j] = 0; P[0][j] = 3; } // inicio libre en la referencia
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const s = sim(A[i - 1], B[j - 1]);
    const d = S[i - 1][j - 1] + (s >= 0.5 ? s : s - 1);
    const u = S[i - 1][j] + GAP, l = S[i][j - 1] + GAP;
    if (d >= u && d >= l) { S[i][j] = d; P[i][j] = 1; } else if (u >= l) { S[i][j] = u; P[i][j] = 2; } else { S[i][j] = l; P[i][j] = 3; }
  }
  let j = 0, best = -1e9; for (let k = 0; k <= m; k++) if (S[n][k] > best) { best = S[n][k]; j = k; } // final libre
  let i = n; const pairs = new Array(n).fill(-1);
  while (i > 0 && j > 0) {
    const p = P[i][j];
    if (p === 1) { if (sim(A[i - 1], B[j - 1]) >= 0.5) pairs[i - 1] = j - 1; i--; j--; }
    else if (p === 2) i--; else j--;
  }
  // huecos: palabra sin pareja entre dos emparejadas con exactamente una palabra libre en la referencia
  for (let k = 0; k < n; k++) if (pairs[k] < 0) {
    const a = k > 0 ? pairs[k - 1] : -2, b = k < n - 1 ? pairs[k + 1] : -2;
    if (a >= 0 && b >= 0 && b - a === 2) pairs[k] = a + 1;
    else if (a >= 0 && b === -2 && a + 1 < m && k === n - 1) pairs[k] = a + 1;
  }
  return pairs;
}

// lines: salida de analyze(). Devuelve [{text, flag, note, ref, word}] por palabra y cortes de renglón.
export function transcribe(lines, refText, opt = {}) {
  const items = [];
  for (const L of lines) {
    for (const W of L.words) if (W.letters.length) items.push({ W, L, ocr: W.ocr.t, ocrL: letters(W.ocr.t) });
    items.push({ br: true, L });
  }
  const words = items.filter(x => !x.br);
  const R = refText ? refWords(refText) : [];
  const pairs = R.length ? alignWords(words.map(x => skel(x.ocr)), R.map(skel)) : [];
  words.forEach((x, k) => {
    const n = x.W.letters.length;
    const ref = pairs[k] >= 0 ? R[pairs[k]] : null;
    x.ref = ref;
    let chars = x.ocrL, src = 'ocr';
    const conf = x.W.ocr.c ?? 0;
    if (ref && letters(ref).length === n && (sim(skel(x.ocr), skel(ref)) >= 0.75 || conf < 80)) { chars = letters(ref); src = 'ref'; }
    x.text = renderWord(x.W.letters, chars);
    x.trail = (x.ocr.match(/[.,:;?!)\]]+$/) || [''])[0].replace(/[)\]]/g, '');
    const notes = [];
    if (chars.length !== n) notes.push(`el lector separó ${n} letras y el OCR leyó ${chars.length}`);
    if (x.text.includes('?')) notes.push('marca no reconocida');
    if (R.length && !ref) notes.push('no se encontró en la referencia');
    if (ref && src === 'ocr') notes.push(`la referencia tiene ${letters(ref).length} letras: «${pointed(ref)}»`);
    if (ref && src === 'ref' && skel(x.ocr) !== skel(ref) && sim(skel(x.ocr), skel(ref)) < 0.75) notes.push(`letras: OCR «${x.ocr}», referencia «${pointed(ref)}»`);
    x.info = [];
    if (ref && src === 'ref') {
      const a = pointed(x.text), b = pointed(ref), strip = t => t.replace(/[\u05BD\u05BF]/g, '').replace(/\u05C7/g, '\u05B8');
      if (strip(a) !== strip(b)) notes.push(`la imagen dice «${a}», la referencia «${b}»`);
      else if (a !== b) x.info.push('meteg/rafe tomados de la imagen');
    }
    if (x.W.letters.some(l => l.square)) x.info.push('shevá cuadrada → rafe');
    if (x.W.letters.some(l => l.doubtSquare)) notes.push('shevá: no está claro si es cuadrada o redonda');
    // ruido: texto en otro idioma o basura de interfaz leída como hebreo
    x.noise = false;
    x.flag = notes.length > 0 && !x.noise; x.notes = notes;
  });
  // ruido: texto en otro idioma o interfaz leído como hebreo. Se descarta por renglón, no por palabra,
  // para no perder palabras sin nikud legítimas (יהוה, títulos).
  const byL = new Map();
  for (const x of words) { if (!byL.has(x.L)) byL.set(x.L, []); byL.get(x.L).push(x); }
  for (const ws of byL.values()) {
    const bare = ws.filter(x => !/[\u05B0-\u05BC]/.test(x.text)).length / ws.length;
    const conf = ws.reduce((a, x) => a + (x.W.ocr.c ?? 0), 0) / ws.length;
    for (const x of ws) if (!x.ref && ((bare >= 0.6 && conf < 70) || ((x.W.ocr.c ?? 0) < 40 && !/[\u05B0-\u05BC]/.test(x.text)) || (letters(x.text).length <= 1 && (x.W.ocr.c ?? 0) < 60))) { x.noise = true; x.flag = false; }
  }
  return items;
}

// Texto final tipo bloc.
export function toBloc(items, opt = {}) {
  const out = []; let cur = [];
  const lines = items.filter(x => x.br).map(x => x.L);
  const gaps = lines.slice(1).map((L, i) => L.top - lines[i].top).filter(g => g > 0).sort((a, b) => a - b);
  const step = gaps[gaps.length >> 1] || 1;
  let prev = null;
  for (const x of items) {
    if (x.br) { prev = x.L; continue; }
    if (x.noise) continue;
    if (prev && x.L !== prev && (opt.keepLines || x.L.top - prev.top > 1.7 * step)) { out.push(cur.join(' ')); cur = []; }
    prev = x.L;
    let t = x.text + (x.trail || '');
    if (opt.jd !== false) t = jdForm(t);
    cur.push(t);
  }
  if (cur.length) out.push(cur.join(' '));
  return out.join(opt.keepLines ? '\n' : '\n\n');
}

// Convenciones JD de los másters: U+05C7 → U+05B8; יהוה (con o sin nikud, con prefijo) → יְיָ.
export function jdForm(w) {
  w = w.replace(/ׇ/g, 'ָ');
  const sk = skel(w);
  const m = sk.match(/^([ולבכמשה]*)יהוה$/);
  if (m) {
    const n = m[1].length; let i = 0, k = 0;
    while (k < w.length && i <= n) { if (/[א-ת]/.test(w[k])) i++; if (i > n) break; k++; }
    return w.slice(0, k) + 'יְיָ' + w.slice(w.length).replace(/^/, '') + (w.match(/[.,:;?!]+$/) || [''])[0];
  }
  return w;
}
