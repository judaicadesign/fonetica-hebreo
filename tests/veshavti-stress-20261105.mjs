import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,metegPosition});');
for(const [hebrew,expected] of [
 ['וְשַׁבְתִּי','Veshavtí'],
 ['וְשַֽׁבְתִּי','Veshavti'],
 ['שָׁכַבְתִּי','Shajavti'],
 ['הֱקִיצוֹתִי','Hekitsoti'],
 ['וְנָתַתִּי','Venatatí']
])for(const form of [hebrew,hebrew.normalize('NFD')])assert.equal(api.phonetize(form),expected,hebrew);
assert.match(api.phonetize('וְשַׁבְתִּי בְּבֵית יְיָ'),/^Veshavtí /u);
assert.equal(api.metegPosition('וְשַׁבְתִּי'),-1,'final stress must not invent a meteg');
console.log('PASS: veshavtí without meteg, explicit meteg respected, NFC/NFD, partial verse, other perfect -ti forms unchanged');
