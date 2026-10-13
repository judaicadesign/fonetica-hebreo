// Evalúa rafe y meteg derivados por el motor (sin teamim) contra el hebreo de ArtScroll.
// uso: node tools/marks_eval.mjs <texto.txt> [--list]
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({addVisualMarks,stripVisualMarks,phonetize});');
const marks=w=>{const r={m:[],r:[]};let k=-1;for(const ch of w.normalize('NFD')){if(/[א-ת]/.test(ch))k++;else if(ch==='ֽ')r.m.push(k);else if(ch==='ֿ')r.r.push(k);}return r;};
const list=process.argv.includes('--list');
let pg=0,words=0,mOk=0,mBad=0,rOk=0,rBad=0,wOk=0;const bad=[];
for(const ln of fs.readFileSync(process.argv[2],'utf8').split('\n')){const m=ln.match(/=== PDF pág\. (\d+)/);if(m){pg=+m[1];continue}if(ln.startsWith('#'))continue;
 for(const tok0 of ln.trim().split(/[\s־]+/)){ if(!/[א-ת]/.test(tok0))continue;
  const tok=tok0.normalize('NFD').replace(/[^֑-ׇא-ת]/g,'').normalize('NFC');
  if(/אְֶ|ענטש/.test(tok)||tok.normalize('NFD').includes('ְֶ'))continue; // defectos del PDF / yidish
  const act=marks(tok); let pred;
  try{pred=marks(api.addVisualMarks(tok,{meteg:true,rafe:true}))}catch(e){continue}
  words++;
  const ms=JSON.stringify(act.m)===JSON.stringify(pred.m), rs=JSON.stringify(act.r)===JSON.stringify(pred.r);
  ms?mOk++:mBad++; rs?rOk++:rBad++; if(ms&&rs)wOk++; else bad.push({pg,tok,act,pred,ms,rs});
 }}
console.log(`palabras ${words} | meteg igual ${mOk} distinto ${mBad} | rafe igual ${rOk} distinto ${rBad} | palabras 100% iguales ${wOk}`);
if(list)for(const b of bad)console.log(b.pg,b.tok,b.ms?'':`meteg AS=${b.act.m} MOTOR=${b.pred.m}`,b.rs?'':`rafe AS=${b.act.r} MOTOR=${b.pred.r}`);
