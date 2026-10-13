// Meteg y rafe son ayudas visuales: la fonética debe ser idéntica con o sin ellas.
// Recorre todo el vocabulario de los masters (Tehilim + Bircat Hamazón) si están disponibles.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,addVisualMarks,stripVisualMarks,applyVisualMarks});');
const words=new Set();
const roots=[process.env.JD_MASTERS||'/home/claude/judaicadesign/judaica-design-system/masters'];
const add=t=>{for(const w of t.split(/[\s־]+/))if(/[א-ת]/.test(w))words.add(w.replace(/[^֑-ׇא-ת]/g,''))};
for(const r of roots){try{const d=JSON.parse(fs.readFileSync(r+'/tehilim/tehilim.json','utf8'));const approved=new Set(process.env.JD_FULL?d.items.map(i=>i.chapter):(d.approvedChapters||[1,2,3,4,5,6,7,14,126,137]));
 for(const it of d.items)if(approved.has(it.chapter))for(const v of it.verses||[])add(v.hebrew||'');
 for(const f of fs.readdirSync(r+'/bircat-hamazon'))if(/HEBREO.*\.txt$/.test(f))add(fs.readFileSync(r+'/bircat-hamazon/'+f,'utf8'));}catch(e){}}
// casos fijos (siempre corren)
const fixed=new Set();
for(const w of ['אֶזְכְּרֵכִי','וּמְבָרְכִים','וְקָבְעוּ','הַלְלוּיָהּ','בְּרִיתְךָ','לָנוּ','שִׁירוּ','תּוֹרָתְךָ','כְּשֶׁעָמְדָה']){words.add(w);fixed.add(w);}
let n=0,marked=0;const bad=[];
for(const w of words){const base=api.phonetize(w);
 for(const opt of (fixed.has(w)?[{meteg:true},{rafe:true},{meteg:true,rafe:true}]:[{meteg:true,rafe:true}])){const m=api.applyVisualMarks(w,opt);
  if(m.normalize('NFC')!==w.normalize('NFC'))marked++;
  if(api.phonetize(m)!==base)bad.push([w,JSON.stringify(opt),base,api.phonetize(m)]);}
 n++;}
if(bad.length)console.log(bad.slice(0,40).map(b=>b.join(' | ')).join('\n'));
assert.equal(bad.length,0,bad.length+' palabras cambian de fonética al aplicar marcas visuales');
// reversible: quitar las marcas devuelve el texto original sin marcas
for(const w of fixed)assert.equal(api.stripVisualMarks(api.applyVisualMarks(w,{meteg:true,rafe:true})).normalize('NFC'),api.stripVisualMarks(w).normalize('NFC'),'reversible '+w);
// maqqef: la primera palabra de un compuesto no recibe meteg
assert.ok(!/\u05BD/.test(api.applyVisualMarks('אֶת־הַשָּׁמַיִם',{meteg:true}).normalize('NFD').split('\u05BE')[0]),'maqqef sin meteg');
console.log('PASS: meteg/rafe no cambian la fonética ('+n+' palabras, '+marked+' con marcas añadidas), reversibles, maqqef respetado');
