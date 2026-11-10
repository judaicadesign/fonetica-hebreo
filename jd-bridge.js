/* Puente de correspondencia para el sistema interno JD.
   Solo lectura: devuelve la correspondencia palabra por palabra que ya calcula el motor
   (phonetizeDetailed), la misma que usa el resaltado al tocar una palabra en el editor.
   No cambia reglas, no toca el texto del editor ni el borrador, y no guarda nada.
   Responde únicamente a los orígenes JD y solo a la ventana que preguntó. */
(() => {
  'use strict';
  const ALLOWED = new Set(['https://judaicadesign.github.io', location.origin]);
  const MAX_TEXTS = 400, MAX_CHARS = 400000;
  const clean = r => ({
    out: r.out,
    items: r.items.map(x => ({ hs: x.hs, he: x.he, os: x.os, oe: x.oe, label: !!x.label }))
  });
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || data.type !== 'jd-correspondence-request') return;
    if (!ALLOWED.has(event.origin) || !event.source) return;
    const texts = Array.isArray(data.texts) ? data.texts.slice(0, MAX_TEXTS) : [];
    const results = texts.map(text => {
      if (typeof text !== 'string' || text.length > MAX_CHARS) return { error: 'Texto inválido' };
      try { return clean(phonetizeDetailed(text)); }
      catch (error) { return { error: String(error && error.message || error) }; }
    });
    event.source.postMessage({ type: 'jd-correspondence-result', id: data.id, results }, event.origin);
  });
  // Aviso sin datos: el sistema sabe que puede preguntar.
  if (window.parent !== window) window.parent.postMessage({ type: 'jd-correspondence-ready' }, '*');
})();
