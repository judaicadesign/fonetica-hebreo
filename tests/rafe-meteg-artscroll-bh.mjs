// Rafe y meteg derivados por el motor (sin teamim y sin mirar la fuente) contra el hebreo exacto de
// ArtScroll Interlinear Benching (ashkenaz), extraído glifo por glifo del PDF.
// Excluye dos defectos del PDF (hataf-segol roto en אְֶ) y una palabra en yidish.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({addVisualMarks,phonetize});');
const marks=w=>{const r={m:[],r:[]};let k=-1;for(const ch of w.normalize('NFD')){if(/[א-ת]/.test(ch))k++;else if(ch==='ֽ')r.m.push(k);else if(ch==='ֿ')r.r.push(k);}return r;};
let words=0,mOk=0,rOk=0;const rafeBad=[];
for(const ln of fs.readFileSync(new URL('./fixtures/artscroll-bircat-hamazon-pdf.txt',import.meta.url),'utf8').split('\n')){
 if(ln.startsWith('#')||ln.startsWith('==='))continue;
 for(const t of ln.split(/[\s־]+/)){ if(!/[א-ת]/.test(t))continue;
  const tok=t.normalize('NFD').replace(/[^֑-ׇא-ת]/g,'').normalize('NFC');
  if(/ענטש|וועל/.test(tok.replace(/[\u0591-\u05C7]/g,''))||tok.normalize('NFD').includes('\u05B0\u05B6'))continue;
  const act=marks(tok),pred=marks(api.addVisualMarks(tok,{meteg:true,rafe:true}));words++;
  if(JSON.stringify(act.m)===JSON.stringify(pred.m))mOk++;
  if(JSON.stringify(act.r)===JSON.stringify(pred.r))rOk++;else rafeBad.push([tok,act.r,pred.r]);
 }}
assert.equal(rafeBad.length,0,'Rafe distinto de ArtScroll: '+JSON.stringify(rafeBad));
assert.ok(mOk/words>=0.955,'Meteg: coincidencia '+(mOk/words).toFixed(3)+' < 0.955');
// Las cinco formas con rafe en ArtScroll que antes se leían con shevá muda: ahora shevá na (e).
for(const [h,exp] of [['וְקָבְעוּ',"Vekave'ú"],['וּמְבָרְכִים','Umevarejim'],['וְהָרְחָבָה','Veharejavá'],['שֶׁנִּתְבָּרְכוּ','Shenitbarejú'],['כְּשֶׁעָמְדָה',"Keshe'amedá"]])assert.equal(api.phonetize(h),exp,h);
console.log(`PASS: rafe ${rOk}/${words} idéntico a ArtScroll; meteg ${mOk}/${words} (${(100*mOk/words).toFixed(1)} %) derivado por reglas, sin teamim`);
