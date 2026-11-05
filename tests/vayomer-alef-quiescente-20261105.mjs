// Segolado con álef quiescente tras jolam: וַיֹּ֣אמֶר (Bereshit 1:3) y אֹ֑מֶר (Tehilim 19:3) son milel.
// Contraejemplos con pataj (תֹּאמַר, יֹאמַר) siguen milrá. Nivel 3 (teamim).
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
for(const [h,e] of [['וַיֹּאמֶר','Vayómer'],['וַתֹּאמֶר','Vatómer'],['אֹמֶר','Ómer'],['וַיֹּֽאמֶר','Vayómer'],['תֹּאמַר','Tomar'],['יֹאמַר','Yomar'],['לֵאמֹר','Lemor']])
  for(const f of [h,h.normalize('NFD')])assert.equal(api.phonetize(f),e,h);
assert.match(api.phonetize('וַיֹּאמֶר יְיָ אֶל הַשָּׂטָן'),/^Vayómer /u);
console.log('PASS: Vayómer (álef quiescente tras jolam), contraejemplos con pataj milrá');
