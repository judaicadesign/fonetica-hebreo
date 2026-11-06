import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
for(const [h,e] of [['הַכִּפּוּרִים','Hakipurim'],['פּוּרִים','Purim'],['בַּפּוּרִים','BaPurim'],['מֵהַפּוּרִים','MehaPurim'],['וְהַחֲנֻכָּה','VehaJanuká'],['הַקֹּרַח','HaKoraj']])
  assert.equal(api.phonetize(h),e,h);
console.log('PASS: ה solo cierra un prefijo compuesto (הַכִּפּוּרִים ≠ ה+כ+Purim); Purim/Januká con prefijo real intactos');
