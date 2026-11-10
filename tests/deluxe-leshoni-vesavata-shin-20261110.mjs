// Revisión Birkón Deluxe Sefaradí/Jabad, 10/11/2026 (decisiones del titular):
// 1) posesivo -י sobre נ radical tras jolam male es tónico: לְשׁוֹנִי → leshoní (el sufijo objeto -נִי sigue átono);
// 2) וְשָׂבָעְתָּ (Devarim 8:10, atnaj en la ב) lleva méteg y el acento en «va»: vesava'ta;
// 3) guersháyim dentro de una palabra con nikud (שִׁי״ן) no corta la palabra ni se pronuncia.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks,phonetize});');
for(const [h,e] of [
  ['לְשׁוֹנִי','Leshoní'],['אֲדוֹנִי','Adoní'],['עֲוֹנִי',"'Avoní"],
  ['הוֹשִׁיעֵנִי',"Hoshi'eni"],['יְנַחֲמֻנִי','Yenajamuni'],['יִסְמְכֵנִי','Yismejeni'],   // contraejemplos: sufijo objeto átono
  ['וְשָׂבָעְתָּ',"Vesava'ta"],['וְשָׂבָֽעְתָּ',"Vesava'ta"],['וְאָכַלְתָּ','Veajaltá'],['וּבֵרַכְתָּ','Uverajtá'],
  ['שִׁי״ן','Shin'],['חב״ד','חב״ד'],['יו״ד','יו״ד']])
  assert.equal(a.phonetize(h),e,h);
assert.ok(a.applyVisualMarks('וְשָׂבָעְתָּ',{meteg:true}).normalize('NFC')==='וְשָׂבָֽעְתָּ'.normalize('NFC'),'וְשָׂבָעְתָּ: méteg en la ב');
assert.ok(!a.applyVisualMarks('וְאָכַלְתָּ',{meteg:true}).includes('ֽ'),'וְאָכַלְתָּ: milrá, sin méteg');
console.log('PASS: leshoní / vesava\'ta con méteg / shin (10/11/2026)');
