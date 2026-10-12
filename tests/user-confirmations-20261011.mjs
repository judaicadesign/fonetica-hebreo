import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,rawTranslit,wordOutput,phoneWord,APPROVED,GOLD});');
const readings=[['בֵיתְךָ','betejá'],['נַעַר',"ná'ar"],['שֶׁהִנְחַלְתָּ','shehinjalta'],['הַלְלוּיָהּ','haleluYah'],['עַבְדָּךְ',"'avdaj"],['וּרְחָבָה','urjavá'],['וְרַחֵם','verajem'],['יוֹמָא','Yomá'],['טָבָא','Tavá']];
for(const [w,expected]of readings)for(const word of [w,w.normalize('NFD')]){
 assert.equal(a.wordOutput(word),expected,w+' fallback');
 assert.equal(a.phoneWord(word,'',false,''),expected,w+' active');
 assert.equal(a.phonetize('אֶת '+word),'Et '+expected,w+' sentence middle');
}
for(const [w,p]of [['בִּרְשׁוּת','birshut'],['חֻקֵּי','juké'],['עָלֵינוּ',"'alenu"],['תְּהִלַּת','tehilat'],['וְזַרְעוֹ',"vezar'ó"]]){
 const capital=p.replace(/[a-z]/,c=>c.toUpperCase());
 assert.equal(a.wordOutput(w),p,w+' common word');
 assert.equal(a.phonetize('אֶת '+w),'Et '+p,w+' middle');
 assert.equal(a.phonetize('אֶת. '+w),'Et. '+capital,w+' after period');
 assert.equal(a.phonetize(w),capital,w+' first word');
}
assert.equal(a.rawTranslit('מִנַּעַר'),"miná'ar",'Prefix preserves verified lexical stress');
assert.equal(a.rawTranslit('הַנַּעַר'),"haná'ar",'Another prefix, no full-word lookup');
assert.equal(a.rawTranslit('מַחַר'),'majar','Do not turn every patah/guttural/patah word into milel');
assert.equal(a.rawTranslit('בֵּיתְךָ'),'betejá','Bet dagesh does not change the source stress');
assert.equal(a.phonetize('אֶת בֵּיתְךָ'),'Et betejá','Dotted bet uses the same sheva/stress reading');
assert.equal(a.phonetize('אֶת בֵּיתֶךָ'),'Et beteja','Segol is a different confirmed reading');
assert.equal(a.phonetize('אֶת עַבְדֶּךָ'),"Et 'avdeja",'Segol must not become qamats');
console.log('PASS user readings: public pipeline, source distinctions, prefixes, NFC/NFD and sentence/editorial capitals');
for(const w of ['וּבְרַחֲמִים','וּבְרַחֲמִים'.normalize('NFD')]){
 assert.equal(a.rawTranslit(w),'uvrajamim');
 assert.equal(a.phoneWord(w,'',false,''),'uvrajamim','Retired lexical value cannot override the structural fallback');
 assert.equal(a.phonetize('בְּחֵן בְּחֶֽסֶד '+w),'Bején bejésed uvrajamim');
}
