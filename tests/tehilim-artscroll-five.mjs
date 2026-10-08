import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+source+';({phonetize,verifiedTehilimOctober7});',{}, {timeout:20000});
const cases=[
 ['בְּצִדְקָתְךָ','לְעוֹלָם','פַלְּטֵנִי','betsidkatejá'],
 ['צִדְקָתְךָ','','כְּהַרְרֵי','tsidkatejá'],
 ['יֹאבֵדוּ','רְשָׁעִים','וְאֹיְבֵי','yovedu'],
 ['יְמִינְךָ','כִּי','וּזְרוֹעֲךָ','Yeminejá'],
 ['הָרִיעוּ','כָף','לֵאלֹהִים',"harí'u"]
];
for(const [word,prev,next,expected] of cases){
 assert.equal(api.verifiedTehilimOctober7(word,prev,next),expected);
 assert.equal(api.verifiedTehilimOctober7(word,'',''),null,'Unreviewed isolated occurrence stays pending');
 const text=[prev,word,next].filter(Boolean).join(' ');
 assert.ok(api.phonetize(text).toLowerCase().includes(expected.toLowerCase()),text+' => '+api.phonetize(text));
 assert.equal(api.verifiedTehilimOctober7(word.normalize('NFD'),prev,next),expected);
}
console.log('PASS Five ArtScroll occurrences: confirmed stress, Spanish accents and context boundaries');
