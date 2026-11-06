import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,mergeContextualNiqqud});');
for(const form of ['יִשְׁמָר','יִשְׁמׇר'])for(const h of [form,form.normalize('NFD')])assert.equal(a.phonetize(h),'Yishmor');
assert.match(a.phonetize('יְהֹוָה יִשְׁמָר צֵאתְֿךָ וּבוֹאֶֽךָ מֵעַתָּה וְעַד עוֹלָם'),/yishmor/u);
const automatic='כִּי בָּנוּ בָּחַרְתָּ';
for(const source of ['כי בנו בחרת','כִּי בנו בחרת']){
 const merged=a.mergeContextualNiqqud(source,automatic);
 assert.equal(merged.split(' ')[1],'בָנוּ'.normalize('NFC'));
 assert.match(a.phonetize(merged),/ vanu /u);
}
for(const source of ['כִּי בָנוּ בָחַרְתָּ','כִּי בָּנוּ בָחַרְתָּ'])assert.equal(a.mergeContextualNiqqud(source,automatic),source,'user pointing remains exact');
assert.ok(a.mergeContextualNiqqud('כי. בנו בחרת',automatic).split(' ')[1].split('נ')[0].includes('\u05BC'),'punctuation blocks contextual correction');
assert.ok(a.mergeContextualNiqqud('הם בנו בית','הֵם בָּנוּ בַּיִת').split(' ')[1].split('נ')[0].includes('\u05BC'),'other readings retain dagesh');
assert.equal(a.phonetize('בָנוּ'),'Vanu');
assert.equal(a.phonetize('יִשְׁכָּב'),'Yishkav','do not turn every final qamats into O');
console.log('PASS isolated/full-verse qamats, automatic banu, explicit niqqud, Unicode forms and unrelated readings');
