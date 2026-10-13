// Sustantivo femenino en -תְךָ (shevá) vs -תֶךָ (segol): ArtScroll Bircat Hamazón, págs. 8 y 9 del libro.
// Sin meteg (pág. 8) => acento final: Toratejá. Con segol y meteg (pág. 9) => acento en el segol: Toratéja (sin tilde en español).
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const api=vm.runInNewContext(stub+source+';({phonetize,rawTranslit});');
const MET='ֽ';
const cases=[
  // [hebreo, fonética pública esperada]
  ['תּוֹרָתְךָ','Toratejá'],                 // shevá, sin meteg: acento final
  ['וְעַל תּוֹרָתְךָ',"Ve'al Toratejá"],     // Torá siempre con T mayúscula
  ['וְעַל תּוֹרָתֶךָ',"Ve'al Torateja"],     // segol: acento penúltimo, sin tilde
  ['עוֹסְקֵי תּוֹרָתֶךָ',"'Oseké Torateja"],
  ['בְּרִיתְךָ','Beritejá'],                 // ArtScroll: rafe en la ת (shevá na), sin meteg
  ['וְעַל בְּרִיתְךָ',"Ve'al beritejá"],
  ['צִדְקָתְךָ','Tsidkatejá'],
  ['וְעַנְוָתְךָ',"Ve'anvatejá"],
  ['לַתּוֹרָה','LaTorá'],
];
for(const [heb,exp] of cases)for(const input of [heb,heb.normalize('NFD')])assert.equal(api.phonetize(input),exp,heb);
// El meteg del segol (ArtScroll) no cambia la fonética ni el acento: sigue siendo Toratéja sin tilde.
assert.equal(api.phonetize('תּוֹרָתֶ'+MET+'ךָ'),'Torateja');
// Los verbos con sufijo objeto -ְךָ NO entran en la regla de sustantivos femeninos.
assert.equal(api.rawTranslit('שֹׁמְרֶךָ'),'shomereja');
console.log('PASS Toratejá (shevá, final) vs Toratéja (segol, meteg), Torá con mayúscula, ArtScroll págs. 8-9');
