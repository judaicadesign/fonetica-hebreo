/** Independent grammatical examples, held-out forms and rejected homographs.
 * Sources: Gesenius §§58c,f and 91b. No whole-word pronunciation lookup.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({rawTranslit,phonetize,APPROVED,FINAL_FORMS,GOLDEN_EDITORIAL,GOLD});',{}, {timeout:20000});
const retired=JSON.parse(fs.readFileSync(new URL('./fixtures/enu-rule-retired.json',import.meta.url),'utf8'));
for(const r of retired){
 const t=r.table==='GOLD.sef.w'?a.GOLD.sef.w:a[r.table];
 assert.ok(r.table==='GOLD.sef.w'?!(r.key in t):!t.has(r.key),'Retired lookup '+r.key);
 for(const w of [r.key,r.key.normalize('NFD')])assert.equal(a.rawTranslit(w),r.value,r.key);
}
// These were not used to infer the rule and are absent from all four tables.
const heldout=[['סוּסֵנוּ','susenu'],['שִׁירֵנוּ','shirenu'],['בִּגְדֵנוּ','bigdenu'],['יִקְטְלֵנוּ','yiktelenu'],['שָׁמְרֵנוּ','shamrenu']];
for(const [word,expected] of heldout){
 for(const t of [a.APPROVED,a.FINAL_FORMS,a.GOLDEN_EDITORIAL])assert.ok(!t.has(word.normalize('NFC')));
 assert.ok(!(word.normalize('NFC') in a.GOLD.sef.w));
 for(const w of [word,word.normalize('NFD')]){
  assert.equal(a.rawTranslit(w),expected,word+' held out');
  assert.equal(a.phonetize('אֶת '+w),'Et '+expected,word+' public pipeline');
 }
}
// Same apparent ending, different morphology: do not silence a stressed plural -u.
for(const [word,expected] of [['יְרַנֵּנוּ','yeranenú'],['יְקַנֵּנוּ','yekanenú'],['כּוֹנְנוּ','konenú'],['יִבְחֲנוּ','yivjanú']]){
 assert.equal(a.rawTranslit(word),expected,word+' counterexample');
}
assert.equal(a.rawTranslit('שִׁירֵנוּ','final'),'shirenú','An independently verified accent overrides inference');
assert.equal(a.phonetize('אֶת תּוֹרָתֵנוּ'),'Et Toratenu','Keep independently approved editorial capitalization');
console.log(`PASS -enu: ${retired.length} retired entries, 5 held-out words, NFC/NFD, public pipeline, 4 counterexamples and source precedence`);
