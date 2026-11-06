import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
for(const h of ['יְרוּשָׁלִָם','יְרוּשָׁלַ‍ִם','יְרוּשָׁלָ‍ִם','יְרוּשָׁלִַם','יְרוּשָׁלַיִם','יְרוּשָׁלָֽיִם'])
  for(const f of [h,h.normalize('NFD')]) assert.equal(api.phonetize(f),'Yerushaláyim',JSON.stringify(f));
for(const [h,e] of [['שָׁלוֹם','Shalom'],['מִצְרַיִם','Mitsráyim'],['הַשָּׁמַיִם','Hashamáyim'],['יְרוּשָׁלַיִם עִירָךְ',"Yerushaláyim 'iraj"]]) assert.equal(api.phonetize(h),e,h);
console.log('PASS: ketiv sin yod de -áyim (kamats/pataj + jirik, cualquier orden, con o sin ZWJ) = Yerushaláyim; formas plenas intactas');
