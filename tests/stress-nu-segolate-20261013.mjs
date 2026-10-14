import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,FINAL_FORMS,APPROVED,GOLDEN_EDITORIAL,GOLD});');
// Reglas solas: sin ninguna excepción léxica.
[api.FINAL_FORMS,api.APPROVED,api.GOLDEN_EDITORIAL].forEach(m=>m.clear());
for(const p of Object.keys(api.GOLD))for(const k of Object.keys(api.GOLD[p].w))delete api.GOLD[p].w[k];
const cases=[['לָנוּ','Lanu'],['אוֹתָנוּ','Otanu'],['וּפְדִיתָנוּ','Ufditanu'],['שֶׁהוֹצֵאתָנוּ','Shehotsetanu'],['גְמָלָנוּ','Guemalanu'],
 ['אֶחָד','Ejad'],['לָהֶם','Lahem'],['לָכֶם','Lajem'],['אֲשֶׁר','Asher'],['קָנוּ','Kanú'],['לֶחֶם','Léjem'],['מֶלֶךְ','Mélej'],
 ['בְתוֹרַת','VeTorat'],['בְּתוֹרַת','BeTorat'],['וּבְּתוֹרָתוֹ','UbeTorató'],['תּוֹרָתֵנוּ','Toratenu'],['תּוֹרוֹת','Torot']];
for(const [w,e] of cases)assert.equal(api.phonetize(w),e,w);
console.log('PASS: -nu átono, segolados vs אֶחָד/לָהֶם/אֲשֶׁר, Torá por regla (sin excepciones léxicas)');
