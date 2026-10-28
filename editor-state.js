/* UI persistence only. Pronunciation and visual-mark rules remain in the engine. */
(() => {
  const KEY = 'jd-phonetics-draft-v1';
  const h = document.getElementById('hebrew');
  const status = document.getElementById('draftStatus');
  const overwrite = document.getElementById('draftOverwrite');
  const retry = document.getElementById('retryNikud');
  const controls = ['autoNikud', 'showMeteg', 'showRafe', 'nakdanGenre'];
  let timer, restoring = false, conflicted = false, known = null;
  const announce = (text, warn = false) => {
    if (status.textContent !== text) status.textContent = text;
    status.className = 'draft-status' + (warn ? ' warn' : '');
  };
  function validDraft(draft) {
    const words = typeof draft?.hebrew === 'string' ? (draft.hebrew.match(HRUN) || []) : [];
    return draft && draft.version === 1 && typeof draft.hebrew === 'string'
      && Array.isArray(draft.words) && draft.words.every(word => word
        && ['user', 'manual', 'nakdan', 'raw'].includes(word.origin)
        && typeof word.sourceWord === 'string' && typeof word.renderedWord === 'string')
      && draft.words.length === words.length
      && draft.words.every((word, i) => word.renderedWord === words[i])
      && draft.preferences && controls.slice(0, 3).every(id => typeof draft.preferences[id] === 'boolean')
      && ['modern', 'rabbinic', 'poetry'].includes(draft.preferences.nakdanGenre);
  }
  function snapshot() {
    return {
      version: 1,
      hebrew: h.value,
      words: reconcileWordState(lastRenderedHebrew, lastWordState, h.value),
      // Alternatives are advisory; manual choices are carried in words above.
      choices: lastNakdanChoices,
      preferences: Object.fromEntries(controls.map(id => {
        const el = document.getElementById(id);
        return [id, el.type === 'checkbox' ? el.checked : el.value];
      }))
    };
  }
  function conflict() {
    conflicted = true;
    overwrite.hidden = false;
    announce('El borrador cambió en otra pestaña. Tu texto sigue aquí. Guardá esta versión si querés reemplazarlo.', true);
  }
  function save(force = false) {
    clearTimeout(timer);
    if (restoring || (conflicted && !force)) return;
    try {
      const current = localStorage.getItem(KEY);
      if (!force && current !== known) { conflict(); return; }
      const next = h.value.trim() ? JSON.stringify(snapshot()) : null;
      if (next !== current) {
        if (next === null) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      }
      known = next;
      conflicted = false;
      overwrite.hidden = true;
      announce(next ? 'Borrador guardado en este navegador. Limpiar también lo descarta.' : 'Sin borrador guardado. Tu próximo texto se guardará en este navegador.');
    } catch {
      announce('No se pudo guardar el borrador en este navegador. Copiá tu texto antes de cerrar o recargar.', true);
    }
  }
  const schedule = () => { clearTimeout(timer); timer = setTimeout(save, 250); };
  function updateRetry() {
    const warning = document.getElementById('nakdanStatus').classList.contains('warn');
    retry.hidden = !(warning && document.getElementById('autoNikud').checked && hasUnpointedWords(h.value));
  }
  async function restore() {
    try {
      known = localStorage.getItem(KEY);
      if (!known) return;
      const draft = JSON.parse(known);
      if (!validDraft(draft)) throw new Error('Invalid draft');
      restoring = true;
      h.value = draft.hebrew;
      for (const id of controls) {
        const el = document.getElementById(id);
        if (el.type === 'checkbox') el.checked = draft.preferences[id];
        else el.value = draft.preferences[id];
      }
      lastRenderedHebrew = draft.hebrew;
      lastWordState = draft.words;
      // Regenerate locally: recovery must never send a saved draft to Nakdan.
      noNakdanOnce = true;
      await run();
      lastNakdanChoices = Array.isArray(draft.choices) ? draft.choices.filter(choice =>
        Number.isInteger(choice?.wordIndex) && choice.wordIndex >= 0 && choice.wordIndex < draft.words.length
        && Array.isArray(choice.options) && choice.options.every(option => typeof option?.text === 'string')) : [];
      renderNakdanWords();
      announce('Borrador recuperado. Se conservaron tu texto, tus elecciones y las opciones de marcas.');
    } catch {
      announce('No se pudo recuperar el borrador. Pegá tu copia para continuar; el borrador anterior no se reemplaza hasta que edites.', true);
    } finally {
      restoring = false;
      updateRetry();
    }
  }
  h.addEventListener('input', schedule);
  for (const id of controls) document.getElementById(id).addEventListener('change', schedule);
  // Engine writes (nikud, undo, clear, paste and alternatives) update these statuses.
  const observer = new MutationObserver(() => { updateRetry(); if (!restoring) schedule(); });
  for (const id of ['nakdanStatus', 'motorStatus']) observer.observe(document.getElementById(id), { childList: true, subtree: true, characterData: true });
  window.addEventListener('pagehide', () => save());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  window.addEventListener('storage', event => { if (event.key === KEY && event.newValue !== known) conflict(); });
  overwrite.addEventListener('click', () => save(true));
  retry.addEventListener('click', async () => {
    retry.disabled = true;
    try { await run(); } finally { retry.disabled = false; updateRetry(); }
  });
  // This deferred script executes before DOMContentLoaded; let the engine build its helpers first.
  window.addEventListener('DOMContentLoaded', restore, { once: true });
})();
