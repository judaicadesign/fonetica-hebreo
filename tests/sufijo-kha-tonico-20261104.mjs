// 04/11/2026 (decisión del titular, nivel 3: teamim de יְבָרֶכְךָ֥ y יְשִֽׂמְךָ֣):
// el sufijo -ְךָ (shevá + ךָ) es siempre tónico, en verbos y sustantivos → tilde.
// La forma con segol -ֶךָ sigue grave (sin tilde). Tras kamats katán la shevá es muda.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const s=t=>api.phonetize(t);
for(const [h,f] of [
 ['יְבָרֶכְךָ','Yevarejejá'],['יְבָרֶכְֿךָ','Yevarejejá'],['יְשִׂימְךָ','Yesimejá'],['יְשַׂגֶּבְֿךָ','Yesaguevejá'],
 ['רְצוֹנְךָ','Retsonejá'],['אוֹדְךָ','Odejá'],['תּוֹרָתְךָ','Toratejá'],['עֶזְרְךָ',"'Ezrejá"],['יַעַנְךָ',"Ya'anjá"],
 ['מִגַּעֲרָֽתְךָ',"Miga'aratejá"],
 // kamats katán + shevá muda
 ['יִשְׁמׇרְךָ','Yishmorjá'],['לִשְׁמׇרְךָ','Lishmorjá'],
 // segol: grave, sin tilde
 ['וְיִשְׁמְרֶֽךָ','Veyishmereja'],['תּוֹרָתֶֽךָ','Torateja'],['וִיחֻנֶּךָּ','Vijuneka'],['שׇׁמְרֶךָ','Shomreja']
])assert.equal(s(h),f,h);
assert.equal(s('יְשִׂימְךָ אֱלֹהִים כְּאֶפְרַיִם וְכִמְנַשֶּׁה.'),'Yesimejá Elohim keEfráyim vejiMnashé.');
assert.equal(s('יְבָרֶכְךָ יְיָ וְיִשְׁמְרֶךָ.'),'Yevarejejá Ad-nai veyishmereja.');
assert.match(s('יְהֹוָה יִשְׁמׇרְךָ מִכׇּל רָע יִשְׁמֹר אֶת נַפְשֶֽׁךָ.'),/Ad-nai yishmorjá mikol ra' yishmor et nafsheja\./);
console.log('PASS: -ְךָ tónico con tilde (verbos y sustantivos), -ֶךָ grave, kamats katán + shevá muda (04/11)');
