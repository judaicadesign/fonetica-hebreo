// Compara meteg y rafé derivados por el motor con un texto de referencia que ya trae las marcas aprobadas.
// Cuenta por marca (esperadas, faltantes, sobrantes) y lista cada error. Palabras sin nikud (indicaciones) se ignoran.
// uso: node tools/bh_marks_eval.mjs <texto.txt> [--json]
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks});');
export function evaluate(text){
  const lines=text.split('\n').filter(l=>!l.startsWith('#'));
  const src=lines.join('\n');
  const strip=s=>s.normalize('NFD').replace(/[ֽֿ]/g,'').normalize('NFC');
  const out=api.applyVisualMarks(strip(src),{meteg:true,rafe:true});
  const toks=s=>[...s.normalize('NFD').matchAll(/[א-ת֑-ׇ]+/g)].map(m=>m[0]);
  const A=toks(src),P=toks(out);
  if(A.length!==P.length)throw new Error('token count mismatch '+A.length+' vs '+P.length);
  const pos=(w,mk)=>{const r=[];let k=-1;for(const ch of w){if(/[א-ת]/.test(ch))k++;else if(ch===mk)r.push(k);}return r;};
  const res={meteg:{expected:0,missing:0,extra:0},rafe:{expected:0,missing:0,extra:0},errors:[]};
  A.forEach((w,i)=>{
    if(!/[ְ-ׇ]/.test(w.replace(/[ֽֿ]/g,'')))return;
    for(const [name,mk] of [['meteg','ֽ'],['rafe','ֿ']]){
      const a=pos(w,mk),p=pos(P[i],mk);
      res[name].expected+=a.length;
      const miss=a.filter(x=>!p.includes(x)),extra=p.filter(x=>!a.includes(x));
      res[name].missing+=miss.length;res[name].extra+=extra.length;
      if(miss.length||extra.length)res.errors.push({word:w.normalize('NFC'),engine:P[i].normalize('NFC'),mark:name,missing:miss,extra});
    }
  });
  return res;
}
if(import.meta.url===`file://${process.argv[1]}`){
  const r=evaluate(fs.readFileSync(process.argv[2],'utf8'));
  if(process.argv.includes('--json'))console.log(JSON.stringify(r,null,1));
  else{
    for(const k of ['meteg','rafe'])console.log(`${k}: esperados ${r[k].expected} · faltan ${r[k].missing} · sobran ${r[k].extra}`);
    for(const e of r.errors)console.log(`${e.mark}\t${e.word}\tmotor: ${e.engine}\t${e.missing.length?'falta ':''}${e.extra.length?'sobra':''}`);
  }
}
