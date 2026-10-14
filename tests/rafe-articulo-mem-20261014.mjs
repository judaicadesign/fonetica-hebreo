/** Rafé tras artículo con pataj sobre מְ sin dagesh (לַמְנַצֵּחַ, ArtScroll 14:1, 67:1). Con יְ ArtScroll no lo imprime. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks,phonetize});',{}, {timeout:20000});
const r=w=>a.applyVisualMarks(w,{rafe:true}).normalize('NFD').includes('ֿ');
assert.equal(r('לַמְנַצֵּחַ'),true);
for(const w of ['הַיְשׁוּעָה','הַיְסוֹד','הַיְשׁוּעוֹת'])assert.equal(r(w),false,w);
assert.equal(a.phonetize('לַמְנַצֵּחַ'),a.phonetize('לַמְֿנַצֵּחַ'));
console.log('PASS: rafé en לַמְ- (artículo + מְ), sin rafé en הַיְ-');
