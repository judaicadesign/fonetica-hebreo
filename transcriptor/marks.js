// Transcriptor JD · análisis de marcas (nikud, meteg, rafe, shevá) sobre la imagen.
// Módulo puro: funciona igual en el navegador y en Node (pruebas).

export function toGray(rgba, w, h) {
  const g = new Uint8Array(w * h);
  for (let i = 0, j = 0; i < g.length; i++, j += 4) {
    const a = rgba[j + 3] / 255;
    g[i] = Math.round((0.299 * rgba[j] + 0.587 * rgba[j + 1] + 0.114 * rgba[j + 2]) * a + 255 * (1 - a));
  }
  return g;
}

// Tinta = fondo local (máximo en ventana) − gris. Sirve para capturas y fotos con luz despareja.
function maxFilter(src, w, h, r) {
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const o = y * w;
    for (let x = 0; x < w; x++) {
      let m = 0; const a = Math.max(0, x - r), b = Math.min(w - 1, x + r);
      for (let k = a; k <= b; k++) if (src[o + k] > m) m = src[o + k];
      tmp[o + x] = m;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let m = 0; const a = Math.max(0, y - r), b = Math.min(h - 1, y + r);
      for (let k = a; k <= b; k++) if (tmp[k * w + x] > m) m = tmp[k * w + x];
      out[y * w + x] = m;
    }
  }
  return out;
}

export function inkMap(gray, w, h, r = 12) {
  const bg = maxFilter(gray, w, h, r);
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < ink.length; i++) { const d = bg[i] - gray[i]; ink[i] = d > 0 ? d : 0; }
  return ink;
}

// Componentes conectados (8 vecinos) dentro de un rectángulo.
export function components(ink, w, h, rect, thr = 80) {
  const { x0, y0, x1, y1 } = rect;
  const W = x1 - x0, H = y1 - y0;
  const lab = new Int32Array(W * H).fill(-1);
  const out = [];
  const qx = new Int32Array(W * H), qy = new Int32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (lab[i] !== -1 || ink[(y + y0) * w + x + x0] < thr) continue;
    const id = out.length; let n = 0, head = 0;
    qx[n] = x; qy[n] = y; n++; lab[i] = id;
    let minx = x, maxx = x, miny = y, maxy = y, area = 0, mass = 0, sx = 0, sy = 0;
    while (head < n) {
      const cx = qx[head], cy = qy[head]; head++;
      const v = ink[(cy + y0) * w + cx + x0];
      area++; mass += v; sx += cx * v; sy += cy * v;
      if (cx < minx) minx = cx; if (cx > maxx) maxx = cx; if (cy < miny) miny = cy; if (cy > maxy) maxy = cy;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (lab[j] !== -1 || ink[(ny + y0) * w + nx + x0] < thr) continue;
        lab[j] = id; qx[n] = nx; qy[n] = ny; n++;
      }
    }
    out.push({ id, x0: minx + x0, x1: maxx + x0 + 1, y0: miny + y0, y1: maxy + y0 + 1, area, mass,
      cx: sx / mass + x0, cy: sy / mass + y0 });
  }
  for (const c of out) { c.w = c.x1 - c.x0; c.h = c.y1 - c.y0; }
  return { comps: out, lab, rect };
}

// ---------- análisis por renglón ----------
const HEB = /[א-ת]/;
const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
export const V = { sheva: 'ְ', hatafSegol: 'ֱ', hatafPatah: 'ֲ', hatafQamats: 'ֳ', hiriq: 'ִ', tsere: 'ֵ',
  segol: 'ֶ', patah: 'ַ', qamats: 'ָ', holam: 'ֹ', qubuts: 'ֻ', dagesh: 'ּ', meteg: 'ֽ',
  rafe: 'ֿ', shin: 'ׁ', sin: 'ׂ' };

// words: [{line, t, b:{x0,y0,x1,y1}}] (del OCR). Devuelve renglones con letras y marcas medidas.
export function analyze(ink, w, h, words, opt = {}) {
  const thr = opt.thr ?? 80;
  const hw = words.filter(x => HEB.test(x.t));
  const byLine = new Map();
  for (const x of hw) { if (!byLine.has(x.line)) byLine.set(x.line, []); byLine.get(x.line).push(x); }
  const { comps } = components(ink, w, h, { x0: 0, y0: 0, x1: w, y1: h }, thr);
  const lines = [];
  for (const [id, ws] of byLine) {
    const x0 = Math.min(...ws.map(q => q.b.x0)), x1 = Math.max(...ws.map(q => q.b.x1));
    const y0 = Math.min(...ws.map(q => q.b.y0)), y1 = Math.max(...ws.map(q => q.b.y1));
    const H = median(ws.map(q => q.b.y1 - q.b.y0));
    // banda del cuerpo de letra: mediana de los componentes grandes dentro de las cajas
    const big = comps.filter(c => c.cx >= x0 && c.cx <= x1 && c.cy >= y0 && c.cy <= y1 && c.h >= 0.35 * H && c.w >= 0.08 * H);
    if (big.length < 2) continue;
    const top = median(big.map(c => c.y0)), bot = median(big.map(c => c.y1));
    lines.push({ id, ws, x0, x1, top, bot, bh: bot - top, comps: [] });
  }
  lines.sort((a, b) => a.top - b.top);
  // cada componente va al renglón cuya banda está más cerca
  for (const c of comps) {
    let best = null, bd = 1e9;
    for (const L of lines) {
      if (c.cx < L.x0 - L.bh || c.cx > L.x1 + L.bh) continue;
      const d = c.cy < L.top ? L.top - c.cy : c.cy > L.bot ? c.cy - L.bot : 0;
      if (d < bd && d < 1.1 * L.bh) { bd = d; best = L; }
    }
    if (best) best.comps.push(c);
  }
  for (const L of lines) buildLine(L);
  if (opt.squareSheva) markSquareSheva(lines);
  return lines;
}

function buildLine(L) {
  const bh = L.bh;
  const isLetterPart = c => c.h >= 0.42 * bh || (c.h >= 0.3 * bh && c.h > 1.4 * c.w && c.cy > L.top && c.cy < L.bot) || (c.w >= 0.5 * bh && c.h >= 0.3 * bh && c.cy > L.top && c.cy < L.bot);
  const isPunct = c => c.y0 > L.top + 0.45 * bh && c.w < 0.35 * bh && c.h < 0.75 * bh;
  let parts = L.comps.filter(c => isLetterPart(c) && !isPunct(c));
  const marks = L.comps.filter(c => !isLetterPart(c) && c.area >= 4);
  // fusionar partes de una misma letra (pata de ה/ק, etc.): solapamiento horizontal fuerte
  parts.sort((a, b) => b.x1 - a.x1);
  const letters = [];
  for (const p of parts) {
    const q = letters.find(l => { const ov = Math.min(l.x1, p.x1) - Math.max(l.x0, p.x0); return ov > 0.5 * Math.min(l.x1 - l.x0, p.w); });
    if (q) { q.x0 = Math.min(q.x0, p.x0); q.x1 = Math.max(q.x1, p.x1); q.y0 = Math.min(q.y0, p.y0); q.y1 = Math.max(q.y1, p.y1); q.parts.push(p); }
    else letters.push({ x0: p.x0, x1: p.x1, y0: p.y0, y1: p.y1, parts: [p] });
  }
  letters.sort((a, b) => b.x1 - a.x1);
  for (const l of letters) { l.cx = (l.x0 + l.x1) / 2; l.below = []; l.above = []; l.inside = []; }
  // palabras: letras cuyo centro cae en la caja OCR
  L.words = L.ws.slice().sort((a, b) => b.b.x1 - a.b.x1).map(wd => ({ ocr: wd, letters: letters.filter(l => l.cx >= wd.b.x0 - 2 && l.cx <= wd.b.x1 + 2) }));
  // marcas → letra
  const dot = median(marks.filter(m => m.w < 0.3 * bh && m.h < 0.3 * bh && m.w / m.h < 1.6 && m.h / m.w < 1.6).map(m => m.area)) || 1;
  L.dotArea = dot;
  for (const m of marks) {
    const wd = L.words.find(W => m.cx >= W.ocr.b.x0 - 4 && m.cx <= W.ocr.b.x1 + 4 && W.letters.length);
    if (wd && m.cx < Math.min(...wd.letters.map(l => l.x0)) - 0.04 * bh && m.cy > L.top + 0.3 * bh) { m.punct = true; continue; }
    // asteriscos y llamadas de nota: muy por encima del renglón
    const over = letters.find(l => m.cx >= l.x0 - 1 && m.cx <= l.x1 + 1);
    const ltop = over ? Math.min(L.top, over.parts.reduce((a, p) => (p.h > 0.6 * bh ? Math.min(a, p.y0) : a), L.top)) : L.top;
    if (m.cy < ltop - 0.42 * bh) { m.note = true; continue; }
    // punto a la izquierda de una yod, a su altura: dagesh de la yod (convención tipográfica de ArtScroll)
    const yod = letters.find(l => l.y1 - l.y0 < 0.7 * bh && l.x1 - l.x0 < 0.45 * bh && m.cx < l.x0 + 1 && m.cx > l.x0 - 0.25 * bh && m.cy > l.y0 && m.cy < l.y1);
    if (yod && m.w < 0.3 * bh) { yod.inside.push(m); m.zone = 'inside'; continue; }
    const under = letters.some(l => m.cx >= l.x0 - 0.08 * bh && m.cx <= l.x1 + 0.08 * bh);
    if (!under && m.cy > L.top + 0.1 * bh) { m.punct = true; continue; }
    const zone = m.cy > L.bot - 0.08 * bh ? 'below' : m.cy < L.top + 0.08 * bh ? 'above' : 'inside';
    m.zone = zone;
    let tgt = null;
    if (zone === 'above') {
      // holam/punto de shin: sobre la letra; si cae entre letras, pertenece a la de la derecha (borde izquierdo)
      tgt = letters.find(l => m.cx >= l.x0 - 1 && m.cx <= l.x1 + 1);
      if (!tgt) tgt = letters.filter(l => l.x0 >= m.cx - 0.15 * bh).sort((a, b) => a.x0 - b.x0)[0];
    } else {
      tgt = letters.find(l => m.cx >= l.x0 && m.cx <= l.x1);
      if (!tgt) tgt = letters.slice().sort((a, b) => Math.abs(a.cx - m.cx) - Math.abs(b.cx - m.cx))[0];
    }
    if (zone === 'above' && tgt) {
      const rel = (m.cx - tgt.x0) / Math.max(1, tgt.x1 - tgt.x0);
      m.rel = rel; m.right = letters[letters.indexOf(tgt) - 1] || null;
    }
    if (tgt) tgt[zone].push(m);
  }
  for (const l of letters) l.marks = classify(l, L);
  L.letters = letters;
}

function shape(m, bh, dot) {
  const r = m.w / m.h, fill = m.area / (m.w * m.h);
  if (m.h / m.w >= 2.2 && m.h < 0.45 * bh) return 'vline';
  if (r >= 2.2) return 'bar';
  const d = Math.sqrt(dot) * 1.13; // diámetro típico de un punto en esta línea
  if (Math.max(m.w, m.h) <= 1.5 * d && r < 1.7 && r > 0.55) return 'dot';
  if (r >= 0.8 && r < 2.2 && fill < 0.62) return 'T';
  return 'blob';
}

function classify(l, L) {
  const bh = L.bh, dot = L.dotArea, out = [];
  // debajo
  const B = l.below.map(m => ({ m, s: shape(m, bh, dot) }));
  const meteg = B.filter(b => b.s === 'vline');
  const rest = B.filter(b => b.s !== 'vline');
  const dots = rest.filter(b => b.s === 'dot').map(b => b.m);
  const bars = rest.filter(b => b.s === 'bar'), Ts = rest.filter(b => b.s === 'T' || b.s === 'blob');
  let vowel = null, extra = null;
  const isV = (a, b) => Math.abs(a.cx - b.cx) < 0.1 * bh && Math.abs(a.cy - b.cy) > 0.1 * bh;
  const isH = (a, b) => Math.abs(a.cy - b.cy) < 0.08 * bh && Math.abs(a.cx - b.cx) > 0.1 * bh;
  const tri = d => { // segol: dos arriba en horizontal y uno abajo entre ellos
    const s = [...d].sort((a, b) => a.cy - b.cy);
    return isH(s[0], s[1]) && s[2].cy - s[0].cy > 0.08 * bh && s[2].cx > Math.min(s[0].cx, s[1].cx) && s[2].cx < Math.max(s[0].cx, s[1].cx);
  };
  // shevá del jataf: el par vertical de más a la izquierda
  let pair = null;
  for (const a of dots) for (const b of dots) if (a !== b && a.cy < b.cy && isV(a, b) && (!pair || a.cx + b.cx < pair[0].cx + pair[1].cx)) pair = [a, b];
  const others = pair ? dots.filter(d => !pair.includes(d)) : dots;
  if (bars.length) vowel = pair ? V.hatafPatah : V.patah;
  else if (Ts.length) vowel = pair ? V.hatafQamats : V.qamats;
  else if (dots.length === 5 && pair && others.length === 3) vowel = V.hatafSegol;
  else if (dots.length === 3) vowel = tri(dots) ? V.segol : V.qubuts;
  else if (dots.length === 2) {
    if (isH(dots[0], dots[1])) vowel = V.tsere;
    else { vowel = V.sheva; const [a, b] = dots; extra = { size: (a.area + b.area) / 2 / dot, w: (a.w + b.w) / 2, h: (a.h + b.h) / 2, fill: (a.area / (a.w * a.h) + b.area / (b.w * b.h)) / 2 }; }
  } else if (dots.length === 1) vowel = V.hiriq;
  else if (dots.length) vowel = '?';
  if (vowel) out.push(vowel);
  if (meteg.length) out.push(V.meteg);
  // arriba
  for (const m of l.above) {
    const s = shape(m, bh, dot);
    if (s === 'bar') { if (!(l.y0 < L.top - 0.15 * bh && l.y0 - m.y1 <= 0.06 * bh)) out.push(V.rafe); }
    else if (s === 'dot') out.push({ dotAbove: (m.cx - l.x0) / Math.max(1, l.x1 - l.x0), m });
  }
  // adentro: dagesh / shuruk
  const ins = l.inside.map(m => ({ m, s: shape(m, bh, dot) }));
  const idots = ins.filter(x => x.s === 'dot').map(x => x.m);
  const ipair = idots.length === 2 && Math.abs(idots[0].cx - idots[1].cx) < 0.1 * bh;
  if (ipair) out.push({ kafPair: true });
  else for (const m of idots) out.push({ dotIn: (m.cx - l.x0) / Math.max(1, l.x1 - l.x0), y: (m.cy - L.top) / bh });
  for (const x of ins) if (x.s === 'T' || x.s === 'blob') out.push({ kafT: true });
  for (const x of ins) if (x.s === 'bar') out.push({ kafBar: true });
  l.sheva = extra || null;
  return out;
}

// Une letras (de OCR o referencia) con las marcas medidas. chars: letras de la palabra, en orden.
export function renderWord(letters, chars) {
  const add = letters.map(() => []);
  letters.forEach((l, i) => {
    const c = chars[i];
    for (const m of l.marks) {
      if (typeof m === 'string') { add[i].push(m); continue; }
      if (m.dotIn !== undefined) { add[i].push(V.dagesh); continue; }
      if (m.kafT) { add[i].push(c === 'ך' ? V.qamats : '?'); continue; }
      if (m.kafPair) { add[i].push(c === 'ך' ? V.sheva : V.dagesh + '?'); continue; }
      if (m.kafBar) { add[i].push(c === 'ך' ? V.patah : '?'); continue; }
      const r = m.dotAbove;
      if (c === 'ש') { add[i].push(r > 0.5 ? V.shin : V.sin); continue; }
      if (c === 'ו' || i === 0 || r < 0.6) { add[i].push(V.holam); continue; }
      // punto en el borde derecho: holam de la letra anterior (a la derecha)
      if (chars[i - 1] === 'ש') add[i - 1].push(V.sin); else add[i - 1].push(V.holam);
    }
  });
  return letters.map((l, i) => ((chars[i] ?? '?') + add[i].join('')).normalize('NFC')).join('');
}

// ArtScroll Sefaradí imprime la shevá na con puntos cuadrados (más grandes y llenos).
// Se separan en dos grupos por página; si los grupos no se distinguen, no se marca nada.
export function markSquareSheva(lines) {
  const S = [];
  for (const L of lines) for (const l of L.letters) if (l.sheva) S.push({ l, L, v: l.sheva.fill * l.sheva.size });
  if (S.length < 6) return { ok: false, n: S.length };
  const v = S.map(s => s.v).sort((a, b) => a - b);
  let lo = v[Math.floor(v.length * 0.25)], hi = v[Math.floor(v.length * 0.75)], t = (lo + hi) / 2;
  for (let k = 0; k < 30; k++) {
    const a = v.filter(x => x < t), b = v.filter(x => x >= t);
    if (!a.length || !b.length) break;
    lo = a.reduce((p, q) => p + q, 0) / a.length; hi = b.reduce((p, q) => p + q, 0) / b.length; t = (lo + hi) / 2;
  }
  if (hi / lo < 1.18) return { ok: false, n: S.length, lo, hi }; // no hay dos tamaños: no se adivina
  for (const s of S) {
    const conf = Math.abs(s.v - t) / (hi - lo);
    if (s.v >= t) { s.l.marks.push('ֿ'); s.l.square = true; }
    if (conf < 0.2) s.l.doubtSquare = true;
  }
  return { ok: true, n: S.length, lo, hi, t };
}
