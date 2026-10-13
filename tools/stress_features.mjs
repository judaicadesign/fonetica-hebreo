// Extrae rasgos estructurales por palabra (los mismos que usa el motor) para aprender reglas de acento tradicional.
// uso: node tools/stress_features.mjs <in.jsonl> <out.csv>   (cada línea: {"w":"palabra","y":"milel|final","src":"..."})
import fs from 'node:fs';import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({stressFeatures,FEATURE_NAMES});');
const rows=fs.readFileSync(process.argv[2],'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const names=api.FEATURE_NAMES;
const out=[['word','y','src',...names].join(',')];
let skipped=0;
for(const r of rows){const f=api.stressFeatures(r.w);if(!f){skipped++;continue}out.push([r.w,r.y,r.src,...names.map(n=>f[n])].join(','));}
fs.writeFileSync(process.argv[3],out.join('\n'));console.log('filas',out.length-1,'omitidas',skipped);
