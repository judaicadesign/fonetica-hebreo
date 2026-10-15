// Alerta (punto 8, 15/10/2026): palabras donde el meteg del modelo y el acento de la fonética no coinciden.
// El meteg debe salir del MISMO acento que la fonética. Lista cada palabra distinta con su lectura y las dos posiciones.
// uso: node tools/stress_meteg_alert.mjs <archivo.txt|.json> [...]
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+
  ';({rawTranslit,metegPosition,clusters,isShuruk,isHolamMale,probe:()=>STRESS_PROBE});');
export function alerts(words){
  const out=[];
  for(const w0 of words){
    const w=w0.normalize('NFD').replace(/[ֽֿ֑-֯]/g,'').normalize('NFC');
    let d; try{ d=api.rawTranslit(w,undefined,true); }catch(e){ continue; }
    if(!d||typeof d!=='object')continue;
    if(/^[ולבמהשכ]*(?:יי|יהוה|אדני|אתה)$/u.test(w.normalize('NFD').replace(/[֑-ׇ]/g,'')))continue;
    const real=d.nuclei.filter(n=>!n.furtive); if(real.length<2)continue;
    let ph; try{ ph=api.rawTranslit(w); }catch(e){ continue; }
    const s=api.probe(); if(s==null)continue;
    const m=api.metegPosition(w);
    const a=api.clusters(w);
    // meteg puede ir en la consonante anterior a la vav-mater (וּ / וֹ)
    const same=m===s||(m===s-1&&(api.isShuruk(a[s])||api.isHolamMale(a[s])));
    const final=s===real.at(-1).clusterIndex;
    if(m>=0&&!same)out.push({word:w,phonetic:ph,kind:'meteg en otra sílaba'});
    else if(m<0&&!final)out.push({word:w,phonetic:ph,kind:'fonética llana sin meteg'});
  }
  return out;
}
if(import.meta.url===`file://${process.argv[1]}`){
  const words=new Set();
  for(const f of process.argv.slice(2)){
    const t=fs.readFileSync(f,'utf8');
    for(const m of t.normalize('NFC').replace(/־/g,' ').matchAll(/[א-ת֑-ׇ]+/g))if(/[ְ-ׇ]/.test(m[0]))words.add(m[0].normalize('NFD').replace(/[ֽֿ֑-֯]/g,'').normalize('NFC'));
  }
  const r=alerts(words);
  const by={};for(const x of r)(by[x.kind]??=[]).push(x);
  console.log(`palabras distintas ${words.size} · alertas ${r.length}`);
  for(const [k,v] of Object.entries(by)){console.log(`\n## ${k} (${v.length})`);for(const x of v)console.log(`${x.word}\t${x.phonetic}`);}
}
