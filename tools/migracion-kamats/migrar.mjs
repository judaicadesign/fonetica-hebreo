/**
 * Migración de kamats katán: U+05B8 → U+05C7 donde las REGLAS del motor lo demuestran.
 *
 * Motivo: hasta noviembre de 2026 la fuente FbFrankReal no tenía el glifo de U+05C7, así que los textos JD escribieron
 * todo kamats con U+05B8. La fuente actualizada ya lo admite. Un U+05B8 no demuestra «a».
 *
 * Qué hace (nunca modifica los originales):
 *   - Lee .txt, .json (tehilim.json o celdas {clave:{body}}) e .idml.
 *   - Clasifica cada U+05B8 con qamatsDiagnosis() del motor (index.html):
 *       seguro   → regla estructural sin léxico ni suposición sintáctica (jataf kamats, shevá + daguesh kal, makaf,
 *                  כל proclítico, daguesh fuerte, vav conversiva con acento retraído, acento conjuntivo);
 *       revisar  → regla morfológica o contextual (imperfecto ligado, sustantivo qotl, sufijos…): se propone, no se aplica;
 *       ambiguo  → el texto no alcanza (kamats + shevá sin meteg/rafé, imperfecto aislado): se lista;
 *       gadol    → se queda U+05B8 (no se lista).
 *   - Por defecto APLICA SOLO «seguro» en una COPIA dentro de la carpeta de salida y escribe el registro.
 *   - Repetible: sobre su propia salida no produce cambios nuevos (los katán ya son U+05C7).
 *
 * Uso:
 *   node tools/migracion-kamats/migrar.mjs --salida DIR [--aplicar seguro|seguro,revisar] [--solo-diagnostico] ARCHIVO…
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {extractEngine} from '../../scripts/extract-engine.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2);
const opt={salida:null,aplicar:new Set(['seguro']),soloDiagnostico:false,files:[]};
for(let i=0;i<args.length;i++){
  if(args[i]==='--salida')opt.salida=args[++i];
  else if(args[i]==='--aplicar')opt.aplicar=new Set(args[++i].split(',').map(s=>s.trim()));
  else if(args[i]==='--solo-diagnostico')opt.soloDiagnostico=true;
  else opt.files.push(args[i]);
}
if(!opt.salida||!opt.files.length){
  console.error('Uso: node tools/migracion-kamats/migrar.mjs --salida DIR [--aplicar seguro[,revisar]] [--solo-diagnostico] ARCHIVO…');
  process.exit(2);
}
for(const c of opt.aplicar)if(!['seguro','revisar'].includes(c)){console.error('Categoría no aplicable: '+c);process.exit(2);}

const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const engine=vm.runInNewContext(stub+extractEngine(fs.readFileSync(path.join(root,'index.html'),'utf8'))+';({qamatsDiagnosis});');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');

/* Reemplaza el kamats de la letra `cluster` de la palabra que empieza en `offset`. Devuelve el texto nuevo o null. */
function replaceAt(text,offset,word,cluster){
  if(offset<0||text.slice(offset,offset+word.length)!==word)return null;
  let k=-1, done=false;
  const nw=word.replace(/[א-ת][֑-ׇ]*/gu,part=>{
    if(++k!==cluster)return part;
    if(!part.includes('ָ'))return part;
    done=true; return part.replace('ָ','ׇ');
  });
  return done?text.slice(0,offset)+nw+text.slice(offset+word.length):null;
}
/* Procesa un texto: devuelve {text, filas}. Las filas registran cada kamats clasificado (excepto gadol). */
function processText(text,where){
  const diag=[...engine.qamatsDiagnosis(text)].filter(d=>d.category!=='gadol');
  const rows=[]; let out=text;
  // De atrás hacia adelante para que los offsets sigan válidos (U+05B8 y U+05C7 tienen el mismo largo igualmente).
  for(const d of diag.sort((a,b)=>b.offset-a.offset||b.cluster-a.cluster)){
    const apply=!opt.soloDiagnostico&&opt.aplicar.has(d.category);
    let applied=false;
    if(apply){ const r=replaceAt(out,d.offset,d.word,d.cluster); if(r!==null){out=r;applied=true;} }
    const line=text.slice(0,d.offset).split('\n').length;
    rows.push({ubicacion:where,linea:line,palabra:d.word,letra:d.cluster+1,categoria:d.category,motivo:d.reason||d.hint||'(sin regla que decida)',aplicado:applied,
      propuesta:replaceAt(d.word,0,d.word,d.cluster)});
  }
  return {text:out,rows:rows.reverse()};
}

/* ---------- ZIP mínimo para IDML (lectura y escritura sin dependencias) ---------- */
function readZip(buf){
  let eocd=buf.length-22; while(eocd>=0&&buf.readUInt32LE(eocd)!==0x06054b50)eocd--;
  if(eocd<0)throw Error('IDML/ZIP inválido');
  const n=buf.readUInt16LE(eocd+10); let p=buf.readUInt32LE(eocd+16); const entries=[];
  for(let i=0;i<n;i++){
    const method=buf.readUInt16LE(p+10), csize=buf.readUInt32LE(p+20), nameLen=buf.readUInt16LE(p+28), extra=buf.readUInt16LE(p+30), comment=buf.readUInt16LE(p+32), local=buf.readUInt32LE(p+42);
    const name=buf.slice(p+46,p+46+nameLen).toString('utf8');
    const lNameLen=buf.readUInt16LE(local+26), lExtra=buf.readUInt16LE(local+28);
    const raw=buf.slice(local+30+lNameLen+lExtra,local+30+lNameLen+lExtra+csize);
    entries.push({name,data:method===0?raw:zlib.inflateRawSync(raw)});
    p+=46+nameLen+extra+comment;
  }
  return entries;
}
const DOS_DATE=((2026-1980)<<9)|(11<<5)|6; // fecha fija: la salida es reproducible byte a byte
function writeZip(entries){
  const locals=[], centrals=[]; let offset=0;
  for(const e of entries){
    const name=Buffer.from(e.name,'utf8'), store=e.name==='mimetype';
    const comp=store?e.data:zlib.deflateRawSync(e.data), crc=zlib.crc32(e.data)>>>0;
    const h=Buffer.alloc(30); h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x0800,6);h.writeUInt16LE(store?0:8,8);h.writeUInt16LE(DOS_DATE,12);
    h.writeUInt32LE(crc,14);h.writeUInt32LE(comp.length,18);h.writeUInt32LE(e.data.length,22);h.writeUInt16LE(name.length,26);
    const c=Buffer.alloc(46); c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x0800,8);c.writeUInt16LE(store?0:8,10);c.writeUInt16LE(DOS_DATE,14);
    c.writeUInt32LE(crc,16);c.writeUInt32LE(comp.length,20);c.writeUInt32LE(e.data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);
    locals.push(h,name,comp); centrals.push(c,name); offset+=30+name.length+comp.length;
  }
  const cd=Buffer.concat(centrals), end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...locals,cd,end]);
}
const decodeXml=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
const encodeXml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- Formatos ---------- */
function processFile(file){
  const buf=fs.readFileSync(file), ext=path.extname(file).toLowerCase(), base=path.basename(file);
  const rows=[]; let outBuf=buf;
  if(ext==='.idml'){
    const entries=readZip(buf);
    for(const e of entries){
      if(!/^Stories\/.*\.xml$/u.test(e.name))continue;
      const xml=e.data.toString('utf8'); let changed=false;
      // Cada <Content> se procesa por separado: las reglas «seguras» son internas a la palabra o al makaf.
      let ci=0;
      const nx=xml.replace(/<Content>([^<]*)<\/Content>/gu,(all,inner)=>{
        ci++;
        const txt=decodeXml(inner); if(!/[ָ]/u.test(txt))return all;
        const r=processText(txt,`${e.name} · Content ${ci}`); rows.push(...r.rows);
        if(r.text===txt)return all; changed=true; return '<Content>'+encodeXml(r.text)+'</Content>';
      });
      if(changed)e.data=Buffer.from(nx,'utf8');
    }
    outBuf=writeZip(entries);
  }else if(ext==='.json'){
    const j=JSON.parse(buf.toString('utf8'));
    if(Array.isArray(j?.items)){
      for(const c of j.items)for(const v of c.verses||[]){const r=processText(v.hebrew,`${c.chapter}:${v.verse}`);rows.push(...r.rows);v.hebrew=r.text;}
    }else if(j&&typeof j==='object'){
      for(const [k,v] of Object.entries(j)){ if(typeof v?.body!=='string'||!/Hebreo/u.test(k))continue; const r=processText(v.body,k);rows.push(...r.rows);v.body=r.text; }
    }
    outBuf=Buffer.from(JSON.stringify(j,null,2)+'\n','utf8');
  }else{
    const r=processText(buf.toString('utf8'),base); rows.push(...r.rows); outBuf=Buffer.from(r.text,'utf8');
  }
  return {rows,outBuf,before:sha(buf),after:sha(outBuf),changed:!buf.equals(outBuf)};
}

fs.mkdirSync(opt.salida,{recursive:true});
const report={fecha:new Date().toISOString(),motor:'index.html '+sha(fs.readFileSync(path.join(root,'index.html'))).slice(0,12),
  aplicar:opt.soloDiagnostico?[]:[...opt.aplicar],archivos:[]};
const allRows=[];
for(const file of opt.files){
  const r=processFile(file); allRows.push(...r.rows.map(x=>({archivo:path.basename(file),...x})));
  const outName=path.basename(file).replace(/(\.[^.]+)$/u,'.kamats-katan$1');
  if(!opt.soloDiagnostico&&r.changed)fs.writeFileSync(path.join(opt.salida,outName),r.outBuf);
  const count=c=>r.rows.filter(x=>x.categoria===c).length;
  report.archivos.push({archivo:file,sha256_original:r.before,sha256_resultado:r.after,salida:!opt.soloDiagnostico&&r.changed?outName:null,
    aplicados:r.rows.filter(x=>x.aplicado).length,seguro:count('seguro'),revisar:count('revisar'),ambiguo:count('ambiguo')});
}
report.filas=allRows;
fs.writeFileSync(path.join(opt.salida,'registro-migracion-kamats.json'),JSON.stringify(report,null,2)+'\n');
const csv=['archivo,ubicacion,linea,palabra,letra,categoria,motivo,aplicado,propuesta',...allRows.map(r=>[r.archivo,r.ubicacion,r.linea,r.palabra,r.letra,r.categoria,r.motivo,r.aplicado,r.propuesta].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','))];
fs.writeFileSync(path.join(opt.salida,'registro-migracion-kamats.csv'),'﻿'+csv.join('\n')+'\n');
for(const a of report.archivos)console.log(`${path.basename(a.archivo)}: aplicados ${a.aplicados} · seguro ${a.seguro} · revisar ${a.revisar} · ambiguo ${a.ambiguo}${a.salida?' → '+a.salida:''}`);
console.log('Registro: '+path.join(opt.salida,'registro-migracion-kamats.{json,csv}'));
