/**
 * Compara dos versiones del motor sobre textos hebreos (másters, borradores) y lista las palabras cuya fonética cambia.
 * Solo lectura: no modifica ningún texto. Sirve para «pasar los másters por el generador» después de cada mejora.
 *
 * Uso:
 *   git show <commit>:index.html > /tmp/motor-anterior.html
 *   node tools/comparar-motor.mjs /tmp/motor-anterior.html index.html salida.json texto1.txt [texto2.txt …]
 * Un archivo .json con {items:[{verses:[{hebrew}]}]} (formato tehilim.json) también se acepta.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';

const [oldPath,newPath,outPath,...inputs]=process.argv.slice(2);
if(!oldPath||!newPath||!outPath||!inputs.length){
  console.error('Uso: node tools/comparar-motor.mjs MOTOR_ANTERIOR.html MOTOR_NUEVO.html SALIDA.json TEXTO…');
  process.exit(2);
}
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const load=p=>vm.runInNewContext(stub+extractEngine(fs.readFileSync(p,'utf8'))+';({phonetizeDetailed});');
const before=load(oldPath), after=load(newPath);

function lines(file){
  const raw=fs.readFileSync(file,'utf8');
  if(file.endsWith('.json')){
    const j=JSON.parse(raw);
    if(Array.isArray(j?.items))return j.items.flatMap(c=>(c.verses||[]).map(v=>({ref:`${c.chapter}:${v.verse}`,text:v.hebrew})));
    return [];
  }
  return raw.split(/\r?\n/).map((text,i)=>({ref:String(i+1),text})).filter(l=>/[א-ת]/u.test(l.text));
}
function words(engine,text){
  const r=engine.phonetizeDetailed(text);
  return (r.items||[]).map(it=>({he:text.slice(it.hs,it.he),ph:r.out.slice(it.os,it.oe)}));
}
const changes=[];
for(const file of inputs){
  for(const {ref,text} of lines(file)){
    const a=words(before,text), b=words(after,text);
    if(a.length!==b.length){
      const oa=before.phonetizeDetailed(text).out, ob=after.phonetizeDetailed(text).out;
      if(oa!==ob)changes.push({file,ref,hebrew:text.slice(0,120),antes:oa,despues:ob,nota:'alineación por palabra no disponible'});
      continue;
    }
    a.forEach((w,i)=>{ if(w.ph!==b[i].ph)changes.push({file,ref,hebrew:w.he,antes:w.ph,despues:b[i].ph}); });
  }
}
fs.writeFileSync(outPath,JSON.stringify({generado:new Date().toISOString(),motores:{antes:oldPath,despues:newPath},textos:inputs,total:changes.length,cambios:changes},null,2)+'\n');
console.log(`${changes.length} palabra(s) con fonética distinta → ${outPath}`);
