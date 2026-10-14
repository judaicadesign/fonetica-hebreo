/** Regla: ו con jolam tras una consonante que ya lleva vocal plena o jatáf es consonante
 * (עָוֹן = 'avón; עֲוֹנוֹתָיו = 'avonot). Sin esto, ArtScroll 130:8 salía 'aonotav.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({rawTranslit});',{}, {timeout:20000});
for(const [w,e] of [['עֲוֹנוֹתָיו',"'avonotav"],['עֲוֺנֹתָיו',"'avonotav"],['עָוֹן',"'avon"]]){
  for(const x of [w,w.normalize('NFD')])assert.match(a.rawTranslit(x).replace(/[áéíóú]/g,m=>({á:'a',é:'e',í:'i',ó:'o',ú:'u'})[m]),new RegExp('^'+e));
}
console.log('PASS: vav con jolam tras jatáf es consonante (עֲוֹנוֹתָיו)');
