import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+source+';({phonetize,reviewedArtScrollTokens,divine});');
const cases=JSON.parse(fs.readFileSync(new URL('./fixtures/artscroll-app-partial-1-9.json',import.meta.url),'utf8'));
for(const c of cases){assert.equal(api.phonetize(c.hebrew),c.phonetic,c.ref);assert.equal(api.phonetize(c.hebrew.normalize('NFD')),c.phonetic,c.ref+' NFD');}
const verse=ref=>cases.find(c=>c.ref===ref);
assert.match(api.phonetize(verse('1:4').hebrew),/kamots asher tidefenu/);
assert.match(api.phonetize(verse('9:4').hebrew),/yikashelú veyóvedu/);
assert.match(api.phonetize(verse('6:8').hebrew),/'ení/);
assert.match(api.phonetize(verse('6:9').hebrew),/bijyí/);
assert.doesNotMatch(api.phonetize(verse('6:9').hebrew),/bijAd-nai/);
assert.equal(api.divine('בִּכְיִי'),null,'Ordinary consonantal yod must not become a divine name');
assert.equal(api.divine('יְיָ'),'Ad-nai');assert.equal(api.divine('לַיְיָ'),'laAd-nai');
assert.equal(api.reviewedArtScrollTokens('תִּדְּפֶֽנּוּ בִּכְיִי').size,0,'A source annotation requires its reviewed context');
assert.equal(api.reviewedArtScrollTokens(verse('1:4').hebrew.replace('תִּדְּ','תִדְ')).size,0,'Different dagesh is not silently accepted');
console.log('PASS: 104 screenshot contexts, vocal sheva, source scope, NFC/NFD and ordinary yod counterexamples');
