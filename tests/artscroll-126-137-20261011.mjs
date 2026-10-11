/**
 * Source-scoped ArtScroll regression: Psalms 126 and 137 plus the
 * confirmed vocal/accent readings in 9:21, 12:2 and 20:10.
 * This test cannot confer editorial FINAL status.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const src='https://raw.githubusercontent.com/judaicadesign/judaica-design-system/main/masters/tehilim/tehilim.json';
const r=await fetch(src,{signal:AbortSignal.timeout(30000)});
if(!r.ok)throw Error('Canon fetch HTTP '+r.status);
const corpus=await r.json();
const engine=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+engine+';({phonetize,reviewedArtScrollTokens});',{}, {timeout:20000});
const check=[126,137];let checked=0;
for(const n of check){
 const c=corpus.items[n-1];assert.equal(c.chapter,n);
 for(const v of c.verses){
  for(const [hebrew,label] of [[v.hebrew,'original'],[v.hebrew.normalize('NFD'),'NFD']]){
   const actual=api.phonetize(hebrew);
   assert.equal(actual,v.phonetic,n+':'+v.verse+' '+label);
  }
  checked++;
 }
 assert.ok(c.verses.some(v=>v.hebrew.includes('יְיָ')),'Editorial Name not normalized in '+n);
}
for(const [n,v,expected] of [[9,21,'Shitá'],[12,2,"Hoshí'a"],[20,10,"hoshí'a"]]){
 const p=corpus.items[n-1].verses[v-1];
 const words=api.phonetize(p.hebrew);
 assert.equal(words,p.phonetic,n+':'+v+' generator vs editorial');
 assert.ok(words.includes(expected),n+':'+v+' expected '+expected+' got '+words);
 assert.equal(api.phonetize(p.hebrew.normalize('NFD')),p.phonetic,n+':'+v+' Unicode');
}
const p=corpus.items[8].verses[20].hebrew;
assert.ok(p.includes('הֵֽמָּה'),'9:21 source must contain confirmed meteg');
assert.ok(!p.includes('שִֽׁיתָה'),'9:21 no invented meteg');
const r137=corpus.items[136].verses[2];
assert.ok(r137.phonetic.includes('divré'),'137:3 historical reading preserved');
const r7=corpus.items[6].verses[0];
assert.ok(r7.phonetic.includes('diveré'),'7:1 FINAL cannot regress');
// Masoretic Tehilim 137:1 and 137:8 have revi'a on the SECOND bet of
// בָּבֶ֗ל. This is milra (ba-VEL), not mil'el. Spanish spelling Bavél.
for(const v of [1,8]){
 const source=corpus.items[136].verses[v-1];
 assert.ok(source.phonetic.includes('Bavél'),'137:'+v+' canonical final stress');
 assert.ok(!source.phonetic.includes('Bável'),'137:'+v+' no wrong initial stress');
 const actual=api.phonetize(source.hebrew);
 assert.equal(actual,source.phonetic,'137:'+v+' generator must retain final stress');
}
console.log('PASS 126 and 137: '+checked+' verses, full phonetics and NFC/NFD; plus 9:21, 12:2, 20:10 user approvals; 7:1 and 137:3 distinct');
