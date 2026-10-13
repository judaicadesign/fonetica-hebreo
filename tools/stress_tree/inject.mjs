// Inserta tree.json en index.html entre los marcadores STRESS_TREE.
import fs from 'node:fs';
const p=new URL('../../index.html',import.meta.url),t=JSON.parse(fs.readFileSync(new URL('./tree.json',import.meta.url),'utf8'));
const code=`/*STRESS_TREE:BEGIN*/
const STRESS_TREE=${JSON.stringify({features:t.features,f:t.f,t:t.t,l:t.l,r:t.r,v:t.v})};
/* Árbol entrenado con ${t.metrics.n_train} palabras de los Tehilim (teamim) · validación por salmo ${t.metrics.cv_by_psalm} · ArtScroll Bircat Hamazón (no visto) ${t.metrics.artscroll_bircat_hamazon}. Regenerar con tools/stress_tree/. */
/*STRESS_TREE:END*/`;
let s=fs.readFileSync(p,'utf8');
if(s.includes('/*STRESS_TREE:BEGIN*/'))s=s.replace(/\/\*STRESS_TREE:BEGIN\*\/[\s\S]*?\/\*STRESS_TREE:END\*\//,code);
else s=s.replace('function metegPosition(word){',code+'\nfunction metegPosition(word){');
fs.writeFileSync(p,s);console.log('árbol insertado',t.metrics);
