import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(html)+';({phonetize,reviewedArtScrollTokens,phoneWord,GOLD,norm});');
const cases=JSON.parse(fs.readFileSync(new URL('./fixtures/artscroll-app-17-20.json',import.meta.url),'utf8'));
for(const c of cases){assert.equal(api.phonetize(c.hebrew),c.phonetic,c.ref);assert.equal(api.phonetize(c.hebrew.normalize('NFD')),c.phonetic,c.ref+' NFD');}
const get=ref=>cases.find(c=>c.ref===ref);
// Independent word expectations, not merely regenerated whole-verse snapshots.
assert.match(get('17:14').phonetic,/Mimetim Yadejá.*mimetim.*vetsefuneja/);
assert.doesNotMatch(get('17:14').hebrew,/וצפינך/,'Do not phoneticize the unpointed ketiv as another word');
assert.match(get('18:6').phonetic,/kidemuni mokeshé/);
assert.match(get('18:33').phonetic,/hameazereni jáyil/);
assert.match(get('18:36').phonetic,/Viminejá.*Ve'anvateja/);
assert.match(get('18:39').phonetic,/yújelu.*tájat/);
assert.match(get('18:39').hebrew,/תַֽחַת/,'No invented initial tav dagesh');
assert.match(get('18:42').phonetic,/Yeshave'ú/);
assert.match(get('18:45').phonetic,/yisháme'u.*yejájashu/);
assert.match(get('18:50').phonetic,/odejá.*azamera/);
assert.match(get('19:10').phonetic,/emet tsadekú/);
assert.match(get('19:11').phonetic,/midevash/);
assert.match(get('19:14').phonetic,/'Avdejá.*étam/);
assert.match(get('20:3').hebrew,/עֶזְרְךָ/);
assert.doesNotMatch(get('20:3').hebrew,/עֶזְרֶֽךָ/,'Rejected visual reading must not return');
assert.match(get('20:3').phonetic,/'ezrejá/);
const review=[...api.reviewedArtScrollTokens(get('20:3').hebrew).values()].find(x=>x.vocalSheva);
assert.deepEqual([...review.vocalSheva],[2],'User correction: vocal resh sheva, silent zayin sheva');
assert.equal(api.reviewedArtScrollTokens(get('20:3').hebrew.replace('עֶזְרְךָ','עֶזְרֶֽךָ')).size,0,'Nikud mismatch invalidates source context');
// Isolate fallback preservation independently of current dictionary contents.
const key=api.norm('אוֹדְךָ'),old=api.GOLD.sef.w[key];api.GOLD.sef.w[key]='odejá';
assert.equal(api.phoneWord('אוֹדְךָ','',false,'',{vocalSheva:[2]}),'odejá');
if(old===undefined)delete api.GOLD.sef.w[key];else api.GOLD.sef.w[key]=old;
console.log('PASS: 69 contexts + NFC/NFD, independent stress/sheva/nikud checks, fallback accent and source scope');
