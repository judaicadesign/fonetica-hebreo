/** 26/10/2026 (titular): shevá tras וּ conjunción es naj; el prefijo del Nombre no lleva tilde propia. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
for(const page of ['../index.html','../beta/index.html']){
  const {phonetize}=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL(page,import.meta.url),'utf8'))+';({phonetize});');
  const cases=[['וּבְהוֹדָאָה','Uvhodaá'],['וּבְמִצְוַת','Uvmitsvat'],['וּלְעוֹלְֿמֵי',"Ul'olemé"],['וּנְכָסֵינוּ','Unjasenu'],['וּלְחַיֵּי','Uljayé'],
    ['וְלַיְיָ','VelaAd-nai'],['וּבַיְיָ','UvaAd-nai'],['לַיְיָ','LaAd-nai'],['בַּיְיָ','BaAd-nai']];
  for(const [h,f] of cases)assert.equal(phonetize(h),f,page+' '+h);
}
console.log('sefaradi-vav-sheva-20261026 OK');
