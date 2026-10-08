import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+source+';({phonetize,reviewedArtScrollTokens,rawTranslit});',{}, {timeout:20000});
const cases=['./fixtures/artscroll-reviewed-23-126-137.json','./fixtures/artscroll-reviewed-ten-psalms.json'].flatMap(f=>JSON.parse(fs.readFileSync(new URL(f,import.meta.url),'utf8')));
for(const c of cases){assert.equal(api.phonetize(c.hebrew),c.phonetic,c.ref);assert.equal(api.phonetize(c.hebrew.normalize('NFD')),c.phonetic,c.ref+' NFD');assert.equal(api.phonetize(c.hebrew.replaceAll(' ','  ')),c.phonetic,c.ref+' spaces');assert.equal(api.phonetize(c.hebrew.replaceAll('יְהֹוָה','יְיָ')),c.phonetic,c.ref+' divine alias');}
assert.equal(api.reviewedArtScrollTokens('אַתָּה שְׁמוֹ וְשַׁבְתִּי').size,0,'Unreviewed contexts must remain separate');
assert.equal(api.reviewedArtScrollTokens('יָבֽוֹא').size,0,'Arbitrary meteg does not establish ArtScroll provenance');
const v3=cases.find(c=>c.ref==='23:3');assert.match(v3.hebrew,/בְמַעְגְּלֵי/);assert.doesNotMatch(v3.hebrew,/בְּמַעְגְּלֵי/);assert.match(api.phonetize(v3.hebrew),/vema'guelé/);
assert.equal(api.reviewedArtScrollTokens(v3.hebrew.replace('בְמַעְגְּלֵי','בְּמַעְגְּלֵי')).size,0,'Different nikud is not silently corrected by the engine');
for(const [word,expected] of [['הָיוּ','hayú'],['קִוְּתָה','kiveta'],['עֲוֺנֹתָיו',"'avonotav"],['עִמְּךָ',"'imjá"]])assert.equal(api.rawTranslit(word),expected,word);
const at=ref=>cases.find(c=>c.ref===ref);
assert.match(at('91:5').phonetic,/mipájad/);assert.match(at('83:13').phonetic,/nirsha/);assert.doesNotMatch(at('83:13').phonetic,/nirshá/);assert.match(at('112:1').phonetic,/^HaleluYah/);
assert.match(at('20:9').hebrew,/קַֽמְנוּ/);assert.doesNotMatch(at('20:9').hebrew,/קַּ/);assert.match(at('120:5').hebrew,/לִּי/);
console.log('PASS: 118 reviewed verses, source-scoped stress, NFC/NFD, unchanged undotted bet and unreviewed counterexamples');
