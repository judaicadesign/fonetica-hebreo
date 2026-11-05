// Vaijulú sin lista por palabra: acento por regla, contrastado con los teamim de Bereshit 2:1-3
// (Miqra al pi haMasorah): וַיְבָ֤רֶךְ milel, וַיְקַדֵּ֖שׁ y וַיִּשְׁבֹּת֙ milrá. Tilde solo si hace falta.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
for(const [h,e] of [['וַיְכַל','Vaijal'],['וַיְכֻלּוּ','Vaijulú'],['וַיְבָרֶךְ','Vaivárej'],['וַיְקַדֵּשׁ','Vaikadesh'],['וַיִּשְׁבֹּת','Vayishbot'],
  ['וַיִּשְׁלַח','Vayishlaj'],['וַיְהִי','Vaihí'],['וְזִמְרָת','Vezimrat']])
  for(const f of [h,h.normalize('NFD')])assert.equal(api.phonetize(f),e,h);
assert.ok(!fs.readFileSync(new URL('../index.html',import.meta.url),'utf8').includes('VAY_FORMS'),'sin lista por palabra');
console.log('PASS: Vaijulú por regla (teamim Bereshit 2:1-3), tildes solo donde hacen falta');
