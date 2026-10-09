import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+source+';({phonetize,REVIEWED_ARTSCROLL_VERSES});');
const get=ref=>api.REVIEWED_ARTSCROLL_VERSES.find(v=>v.ref===ref);
// Expectations written from source review, independently of regenerated full-verse fixtures.
for(const [ref,expected,rejected]of [['9:19',/tikvat/,/tikevat/],['9:20',/yishafetú/,/yishaftú/],['4:5',/vilvavjem.*mishkavjem/,/vilvavejem|mishkavejem/],['6:7',/beanjatí/,/beanejati|beanjati/],['12:4',/sifté/,/sifeté/],['16:2',/^Amart /,/Amaret/],['17:1',/hakshiva/,/hakeshiva/],['10:15',/zeroa'/,/\bzroa'/],['130:4',/'Imejá/,/'Imjá/]])for(const hebrew of [get(ref).hebrew,get(ref).hebrew.normalize('NFD')]){const actual=api.phonetize(hebrew);assert.match(actual,expected,ref);assert.doesNotMatch(actual,rejected,ref);}
for(const [ref,word]of [['9:19','תקות'],['16:2','אמרת'],['17:1','הקשיבה']])assert.equal(get(ref).changes[word]?.vocalSheva,undefined,ref+' false annotation stays absent');
for(const v of api.REVIEWED_ARTSCROLL_VERSES)for(const [word,c]of Object.entries(v.changes))if(c.vocalSheva){const bare=w=>w.replace(/[^א-ת]/gu,'');const token=v.hebrew.match(/[א-ת][א-ת\u0591-\u05c7]*/gu).find(t=>bare(t)===bare(word));const a=[...token.normalize('NFD').matchAll(/[א-ת][^א-ת]*/gu)].map(m=>m[0]);for(const i of c.vocalSheva)assert.ok(a[i]?.includes('\u05b0'),v.ref+' index must designate sheva');}
console.log('PASS: independent word checks, rejected annotations, initial sheva counterexample, NFC/NFD and index validation');

assert.equal(api.phonetize('לַמְנַצֵּחַ'),'Lamenatséaj');
assert.equal(api.phonetize('לַמְנַצֵּֽחַ'),'Lamenatséaj');
assert.equal(get('9:20').changes['ישפטו'].vocalSheva[0],2);

assert.equal(api.phonetize("בְּאַנְחָתִי"),"Beanjatí");
assert.ok(!get("6:7").hebrew.includes("בְּאַנְחָֽתִי"));
