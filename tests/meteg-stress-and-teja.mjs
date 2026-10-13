// Decisiones del usuario (13/10/2026):
// - Un meteg en sílaba no final marca la tónica: נָֽפְלוּ náflu, אָֽכְלוּ ájlu (sin tilde: el español ya acentúa la penúltima).
// - Sin meteg, -תְךָ lleva acento final y necesita tilde (el lector argentino pondría el acento en "te"): vaajuzatejá, bajamatejá.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
for(const [h,exp] of [['נָֽפְלוּ','Naflu'],['אָֽכְלוּ','Ajlu'],['וַאֲחֻזָּתְךָ','Vaajuzatejá'],['בַּחֲמָתְךָ','Bajamatejá'],['חָכְמָה','Jojmá'],['אָזְנַיִם','Oznáyim'],['לָֽמָּה','Lama'],['בִּֽינָה','Bina']])
  for(const w of [h,h.normalize('NFD')])assert.equal(api.phonetize(w),exp,h);
console.log('PASS: meteg = tónica (náflu, ájlu), -תְךָ final con tilde, qamats katan sin marca');
