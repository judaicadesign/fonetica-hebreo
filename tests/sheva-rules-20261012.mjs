import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const api=vm.runInNewContext(stub+source+';({phonetize,rawTranslit,clusters,shevaVocalized,mergeContextualNiqqud,preserveReadingMarks,hasUnpointedWords,APPROVED,FINAL_FORMS,GOLD});');
const readings=[['זְרוֹעַ',"zeroa'"],['שֹׁמְרִים','shomerim'],['מִשֹּׁמְרִים','mishomerim'],['שִׁבְּרוּ','shiberú'],['דַּבְּרוּ','daberú'],['הַלְלוּ','halelú'],['הִנְנִי','hineni'],['הַלְלוּיָהּ','haleluYah'],['לַמְנַצֵּחַ','lamenatséaj'],['לַמְּנַצֵּחַ','lamenatséaj'],['וַיֹּאמְרוּ','vayomerú'],['וַיֹּ֣אמְר֔וּ','vayomerú'],['זָכְרוּ','zajerú'],['נַפְשְׁךָ','nafshejá'],['אַנְתְּ','ant'],['וּבְרַחֲמִים','uvrajamim']];
for(const [word,expected]of readings)for(const input of [word,word.normalize('NFD')]){
 assert.equal(api.rawTranslit(input),expected,'Structural: '+word);
 assert.equal(api.phonetize('אֶת '+input),'Et '+expected,'Public: '+word);
}
// Held-out members and grammatical counterexamples, not lookup values.
for(const [w,p]of [['הַמְדַבֵּר','hamedaber'],['לַמְשַׁלֵּם','lameshalem'],['שָׁמְרוּ','shamerú'],['קָטֹ֣נְתִּי','katonti'],['כׇּלְ','kol'],['חֲכָמִים','jajamim'],['דֳּמִי','domí']])assert.equal(api.rawTranslit(w),p,w);
for(const w of ['הַלְלוּיָהּ','לַמְנַצֵּחַ']){assert.equal(api.APPROVED.has(w),false);assert.equal(api.FINAL_FORMS.has(w),false);assert.equal(w in api.GOLD.sef.w,false);}
const hataf=api.clusters('חֲכָמִים');assert.equal(api.shevaVocalized(hataf,0),true,'Rule 8 is a pronounced reduced vowel, not always e');
assert.equal(api.hasUnpointedWords('זרֽוע בית'),true);
assert.equal(api.mergeContextualNiqqud('זרֽוע בית','זְרוֹעַ בַּיִת'),'זְרֽוֹעַ בַּיִת');
assert.equal(api.mergeContextualNiqqud('זְרֹֽועַ בית','זְרוֹעַ בַּיִת'),'זְרֹֽועַ בַּיִת');
assert.equal(api.preserveReadingMarks('מֿשמרים','מִשֹּׁמְרִים'),'מִֿשֹּׁמְרִים');
assert.throws(()=>api.preserveReadingMarks('זרֽוע','שָׁלוֹם'),/conserva el original/);
console.log('PASS structural sheva rules, independent family words, source holds, reduced vowel quality and Nakdan annotation preservation');
