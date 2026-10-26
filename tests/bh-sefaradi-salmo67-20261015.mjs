/** Regresión 15/10/2026: el motor deriva, sin marcas en la entrada, el meteg y el rafé aprobados del máster
 * «Birkat Hamazón · Sefaradí · Hebreo» (Bircat Shelomó, 14/10) y las marcas de ArtScroll en el Salmo 67. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
import {evaluate} from '../tools/bh_marks_eval.mjs';
const r=evaluate(fs.readFileSync(new URL('./fixtures/bh-sefaradi-bircat-shelomo-20261014.txt',import.meta.url),'utf8'));
/* Única diferencia aceptada, a confirmar en el libro: «יָקִים לָנוּ» (Sucot) sin meteg en el máster; en el resto, לָֽנוּ. */
const known=new Set(['meteg לָנוּ']);
const unexpected=r.errors.filter(e=>!known.has(e.mark+' '+e.word));
assert.deepEqual(unexpected,[],'BH sefaradí: marcas distintas del máster');
assert.equal(r.meteg.expected,258);assert.equal(r.rafe.expected,53);assert.equal(r.rafe.missing+r.rafe.extra,0);
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({applyVisualMarks,phonetize});');
const ps67='לַמְנַצֵּחַ בִּנְגִינֹת מִזְמוֹר שִׁיר. אֱלֹהִים יְחׇנֵּנוּ וִיבָרְכֵנוּ יָאֵר פָּנָיו אִתָּנוּ סֶלָה. לָדַעַת בָּאָרֶץ דַּרְכֶּךָ בְּכׇל גּוֹיִם יְשׁוּעָתֶךָ. יוֹדוּךָ עַמִּים אֱלֹהִים יוֹדוּךָ עַמִּים כֻּלָּם. אֶרֶץ נָתְנָה יְבוּלָהּ יְבָרְכֵנוּ אֱלֹהִים אֱלֹהֵינוּ. יְבָרְכֵנוּ אֱלֹהִים וְיִירְאוּ אוֹתוֹ כׇּל אַפְסֵי אָרֶץ.';
const out=a.applyVisualMarks(ps67,{meteg:true,rafe:true}).normalize('NFC');
for(const w of ['לַמְֿנַצֵּֽחַ','נָתְֿנָה','וְיִירְֿאוּ','יְבָרְֿכֵֽנוּ','לָדַֽעַת','בָּאָֽרֶץ','יוֹדֽוּךָ'])assert.ok(out.includes(w.normalize('NFC')),'Salmo 67: falta '+w);
/* Fonética del mismo acento (puntos 1–7 y 9). */
for(const [h,e] of [['וְאָכַלְתָּ','Veajaltá'],['וּבֵרַכְתָּ','Uverajtá'],['הַנֶּפֶשׁ','Hanéfesh'],['לָדַעַת',"Ladá'at"],['נָתְנָה','Natená'],
  ['לְשָׂבְעָה',"Lesov'á"],['וְרֵיוַח','Verévaj'],['סֻכַּת שְׁלוֹמוֹ','Sukat shelomó'],['יְחָנֵּנוּ','Yejonenu'],['יְרַנֵּנוּ','Yeranenú'],
  ['נַעַר הָיִיתִי',"Ná'ar hayiti"],['בַּעַל הַנֶּחָמוֹת',"Ba'al hanejamot"]])
  assert.equal(a.phonetize(h),e,h);
assert.ok(!a.applyVisualMarks('לְשָׂבְעָה',{rafe:true}).includes('\u05BF'),"lesov'á: kamats katán, shevá muda, sin rafé");
assert.equal(a.phonetize('המזמן: הַב לָן'),'El que dirige: Hav lan');
console.log(`PASS: BH sefaradí ${r.meteg.expected} meteg / ${r.rafe.expected} rafé = máster (salvo «יָקִים לָנוּ», a confirmar); Salmo 67 con las marcas de ArtScroll`);
