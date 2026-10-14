/** Regla 3 del Gaón con qamats: tras prefijo verbal o de participio (א י ת נ מ con shevá o jatáf),
 * la qamats del tema es larga y la shevá siguiente es na (ArtScroll 34:2: rafe en la ר de אֲבָרְכָה).
 * Excepción: con sufijo de perfecto (תּ) la י es raíz y la qamats es katan (יְכָלְתִּיו).
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({rawTranslit});',{}, {timeout:20000});
const plain=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
for(const [w,e] of [['אֲבָרְכָה','avareja'],['וַאֲבָרְכָה','vaavareja'],['יְבָרְכֵנוּ','yevarejenu'],
  ['יְחָרְפֵנִי','yejarefeni'],['מְשָׁרְתָיו','mesharetav'],['מְבָרְכִים','mevarejim'],
  ['בְּחָכְמָה','bejojma'],['יְכָלְתִּיו','yejoltiv']]){
  assert.equal(plain(a.rawTranslit(w)),e,w);
}
console.log('PASS: qamats tras prefijo verbal = vocal larga, shevá na (אֲבָרְכָה)');
