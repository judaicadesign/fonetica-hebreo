// 05/11/2026 (decisiones del titular): כָל sin dagesh = jol (se respeta el texto); הִוא (qeré perpetuo) = hi, sin mayúscula;
// kamats katán sin ׇ por regla: לִCְCָC (infinitivo con ל), vav conversiva de verbo hueco, sustantivo qotl en plural con sufijo.
// Reglas medidas contra Tehilim 1–150 (texto con ׇ): sin falsos positivos. Contraejemplos de kamats gadol incluidos.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const cases=[
 ['כִּי כָל בֵּיתָהּ','Ki jol betáh'],['לֹא תַעֲשֶׂה כָל מְלָאכָה','Lo ta\'asé jol melajá'],['כָּל הַנְּשָׁמָה','Kol haneshamá'],['וְכָל צְבָאָם','Vejol tsevaam'],
 ['אוֹת הִוא לְעֹלָם','Ot hi le\'olam'],['וְהִוא','Vehi'],['כִּי הוּא','Ki Hu'],
 ['לִשְׁבָּת בּוֹ','Lishbot bo'],['לִשְׁבׇּת בּוֹ','Lishbot bo'],['וַתָּקָם','Vatakom'],['וַיָּשָׁב','Vayashov'],['מָתְנֶיהָ','Motneha'],['חָדְשֵׁיכֶם','Jodshejem'],
 // contraejemplos (kamats gadol)
 ['יָדְךָ','Yadejá'],['שָׁמְרוּ','Shamerú'],['הָיְתָה','Hayeta'],['לִדְבָרְךָ','Lidvarejá'],['וַיָּבָא','Vayavá'],['לִשְׁמָע','Lishmá\''],['זָכְרֵנוּ','Zojrenu'],
];
for(const [h,e] of cases) for(const f of [h,h.normalize('NFD')]) assert.equal(api.phonetize(f),e,h);
console.log('PASS: kol/jol por dagesh, הִוא = hi, kamats katán por regla (lishbot, vatakom, motneha, jodshejem) y contraejemplos');
