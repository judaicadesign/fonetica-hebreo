/** Legacy pronunciations now derived by rules; validate independent words, not a copied whole verse. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+source+';({rawTranslit,grammaticalPronoun,divine,proper:word=>PROPER_NOUNS.has(bareLetters(word))||PROPER_NOUNS_EXTRA.has(bareLetters(word)),capitalizeFirst,APPROVED,FINAL_FORMS,GOLDEN_EDITORIAL,GOLD});',{}, {timeout:20000});
const rows=JSON.parse(fs.readFileSync(new URL('./fixtures/rule-derived-pronunciations.json',import.meta.url),'utf8'));
for(const row of rows){
 const table=row.table==='GOLD.sef.w'?a.GOLD.sef.w:a[row.table];assert.ok(row.table==='GOLD.sef.w'?!(row.key in table):!table.has(row.key),'Retired lookup must stay retired: '+row.key);
 for(const word of [row.key,row.key.normalize('NFD')]){
  let output=a.grammaticalPronoun(word)??a.divine(word)??a.rawTranslit(word);if(a.proper(word))output=a.capitalizeFirst(output);assert.equal(output,row.value,row.table+' '+word);
 }
}
console.log('PASS: '+rows.length+' former lookups derived by rules, NFC/NFD and no restored overrides');
