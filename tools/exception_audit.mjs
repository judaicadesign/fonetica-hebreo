// Audita las excepciones léxicas: ¿qué pasa si se elimina cada una? Redundante = misma lectura sin ella.
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,FINAL_FORMS,APPROVED,GOLDEN_EDITORIAL,GOLD});');
const out={redundant:[],real:[]};
const run=(table,key,del,restore)=>{
  const before=api.phonetize(key); del(); const after=api.phonetize(key); restore();
  (before===after?out.redundant:out.real).push({table,key,hoy:before,sinExcepcion:after});
};
for(const [name,m] of [['FINAL_FORMS',api.FINAL_FORMS],['APPROVED',api.APPROVED],['GOLDEN_EDITORIAL',api.GOLDEN_EDITORIAL]]){
  for(const [k,v] of [...m]) if(!/\s/.test(k)) run(name,k,()=>m.delete(k),()=>m.set(k,v));
}
for(const prof of Object.keys(api.GOLD)){
  const w=api.GOLD[prof].w;
  for(const k of Object.keys(w)){const v=w[k];run('GOLD.'+prof,k,()=>{delete w[k]},()=>{w[k]=v});}
}
fs.writeFileSync(process.argv[2]||'/tmp/exc_audit.json',JSON.stringify(out,null,1));
console.log('redundantes',out.redundant.length,'reales',out.real.length);
