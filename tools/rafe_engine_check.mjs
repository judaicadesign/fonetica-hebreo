// Compara la shevá vocal (na) que decide el motor con los rafe reales de ArtScroll.
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const src=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const api=vm.runInNewContext(stub+src+';({rawTranslit,clusters});');
const txt=fs.readFileSync(process.argv[2],'utf8').split('\n');
const out=[];let pg=0;
for(const ln of txt){const m=ln.match(/=== PDF pág\. (\d+)/);if(m){pg=+m[1];continue}if(ln.startsWith('#'))continue;
 for(const tok of ln.trim().split(/[\s־]+/)){ if(!/[א-ת]/.test(tok))continue;
  const clean=tok.normalize('NFD').replace(/[ֽֿ]/g,'').replace(/[^֑-ׇא-ת]/g,'').normalize('NFC');
  const marked=tok.normalize('NFD');
  const cl=[];{let cur=null;for(const ch of marked){if(ch>='א'&&ch<='ת'){cur={b:ch,m:''};cl.push(cur)}else if(cur&&ch>='֑'&&ch<='ׇ')cur.m+=ch}}
  let d;try{d=api.rawTranslit(clean,undefined,true)}catch(e){continue}
  const idx=new Set(d.nuclei.map(n=>n.clusterIndex));
  // alinear: d.a tiene los clusters del motor; cl los del texto original (mismo largo normalmente)
  if(d.a.length!==cl.length){out.push({pg,tok,skip:'len'});continue}
  cl.forEach((c,i)=>{ if(!c.m.includes('ְ'))return;
    const prev=cl[i-1],nx=cl[i+1];
    const dag=c.m.includes('\u05BC'),nextsame=!!nx&&nx.b===c.b,prevsh=!!prev&&prev.m.includes('\u05B0');
    const prevQam=!!prev&&prev.m.includes('\u05B8');
    const prefixInit=i===1&&'והבכלמש'.includes(prev.b)&&!prevQam&&!dag&&!nextsame&&!prevsh;
    out.push({pg,tok,i,n:cl.length,rafe:c.m.includes('\u05BF'),vocal:idx.has(i),prefixInit});}); }}
const sh=out.filter(o=>o.i!==undefined);
const mid=sh.filter(o=>o.i>0);
const ok2=mid.filter(o=>o.rafe===(o.vocal&&!o.prefixInit)).length;console.log('regla de impresión (vocal y no inicial-de-raíz tras prefijo) coincide en',ok2,'de',mid.length);
const tp=mid.filter(o=>o.rafe&&o.vocal).length,fn=mid.filter(o=>o.rafe&&!o.vocal),fp=mid.filter(o=>!o.rafe&&o.vocal);
console.log('shevás',sh.length,'iniciales',sh.length-mid.length,'medias',mid.length,'rafe',mid.filter(o=>o.rafe).length);
console.log('aciertos rafe=vocal',tp,'rafe que el motor NO ve vocal',fn.length,'vocal sin rafe',fp.length,'saltadas',out.filter(o=>o.skip).length);
console.log('--- rafe no detectado'); for(const o of fn)console.log(o.pg,o.tok,o.i);
console.log('--- vocal sin rafe'); for(const o of fp)console.log(o.pg,o.tok,o.i);
console.log('--- desacuerdos con la regla de impresión (esperado = marcas reales de ArtScroll)');
for(const o of mid.filter(o=>o.rafe!==(o.vocal&&!o.prefixInit)))console.log(o.pg,o.tok,'i='+o.i,'ArtScroll:',o.rafe?'rafe':'sin rafe','| motor vocal:',o.vocal,'| prefijo inicial:',o.prefixInit);
