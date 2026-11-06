/** Migración U+05B8 → U+05C7: aplica solo casos seguros, conserva originales, separa revisar/ambiguo,
 * y es repetible (una segunda pasada no cambia nada). Incluye un IDML mínimo. */
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import zlib from 'node:zlib';
import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const tool=new URL('../tools/migracion-kamats/migrar.mjs',import.meta.url).pathname;
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'jd-kamats-'));
const txt=path.join(dir,'texto.txt');
const source='כָּל־הָעָם צָהֳרַיִם חָרְבַּן בְּחָכְמָה\nיְהֹוָה יִשְׁמָר צֵאתְךָ\nאָכְלָה שָֽׁמְרָה כָּתְבוּ\nיִגְדָּל\n';
fs.writeFileSync(txt,source);
/* IDML mínimo: mimetype sin comprimir + una historia. */
function zip(entries){const L=[],C=[];let off=0;for(const [n,d] of entries){const name=Buffer.from(n),data=Buffer.from(d),crc=zlib.crc32(data)>>>0;
 const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(off,42);
 L.push(h,name,data);C.push(c,name);off+=30+name.length+data.length;}
 const cd=Buffer.concat(C),e=Buffer.alloc(22);e.writeUInt32LE(0x06054b50,0);e.writeUInt16LE(entries.length,8);e.writeUInt16LE(entries.length,10);e.writeUInt32LE(cd.length,12);e.writeUInt32LE(off,16);return Buffer.concat([...L,cd,e]);}
const idml=path.join(dir,'pieza.idml');
fs.writeFileSync(idml,zip([['mimetype','application/vnd.adobe.indesign-idml-package'],
  ['Stories/Story_u1.xml','<Story><Content>וּבְטָהֳרָה &amp; מָרְדְּכַי</Content></Story>']]));
const before=[fs.readFileSync(txt),fs.readFileSync(idml)];
const run=(out,...files)=>{const r=spawnSync(process.execPath,[tool,'--salida',out,...files],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(fs.readFileSync(path.join(out,'registro-migracion-kamats.json'),'utf8'));};
const r1=run(path.join(dir,'out1'),txt,idml);
assert.ok(before[0].equals(fs.readFileSync(txt))&&before[1].equals(fs.readFileSync(idml)),'los originales no se tocan');
const migrated=fs.readFileSync(path.join(dir,'out1','texto.kamats-katan.txt'),'utf8');
assert.ok(migrated.startsWith('כׇּל־הָעָם צׇהֳרַיִם חׇרְבַּן '.normalize('NFC')),'primera línea migrada');
for(const w of ['כׇּל','צׇהֳרַיִם','חׇרְבַּן'])assert.ok(migrated.includes(w),'seguro aplicado: '+w);
for(const w of ['בְּחָכְמָה','יִשְׁמָר','אָכְלָה','יִגְדָּל','שָֽׁמְרָה','כָּתְבוּ'])assert.ok(migrated.includes(w),'no se aplica revisar/ambiguo/gadol: '+w);
const rows=r1.filas;
const cat=w=>rows.filter(r=>r.palabra===w).map(r=>r.categoria);
assert.deepEqual(cat('בְּחָכְמָה'),['revisar']);assert.deepEqual(cat('יִשְׁמָר'),['revisar']);
assert.deepEqual(cat('יִגְדָּל'),['ambiguo']);assert.deepEqual(cat('אָכְלָה'),['ambiguo']);
assert.deepEqual(cat('כָּתְבוּ'),['ambiguo']);assert.match(rows.find(r=>r.palabra==='כָּתְבוּ').motivo,/probable gadol/u,'pista para la revisión');
assert.deepEqual(cat('הָעָם'),[],'kamats gadol sin shevá no se lista');
const idmlOut=fs.readFileSync(path.join(dir,'out1','pieza.kamats-katan.idml'));
assert.equal(idmlOut.slice(30,38).toString(),'mimetype','mimetype primero y sin comprimir');
assert.ok(r1.archivos.find(a=>a.archivo===idml).aplicados===2,'IDML: dos casos seguros');
/* Segunda pasada sobre la salida: sin cambios nuevos. */
const r2=run(path.join(dir,'out2'),path.join(dir,'out1','texto.kamats-katan.txt'),path.join(dir,'out1','pieza.kamats-katan.idml'));
assert.ok(r2.archivos.every(a=>a.aplicados===0&&a.salida===null),'repetible: 0 cambios en la segunda pasada');
fs.rmSync(dir,{recursive:true,force:true});
console.log('PASS: migración kamats katán — seguros aplicados en copia, originales intactos, revisar/ambiguo separados, IDML, segunda pasada sin cambios');
