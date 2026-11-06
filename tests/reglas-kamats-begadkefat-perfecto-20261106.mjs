/** 06/11/2026 — Reglas que reemplazan los parches de Codex (concordancia léxica de kamats katán, excepción de frase
 * «כי בנו בחרת» y la lista VAV_CONVERSIVE). Palabras nuevas, fuera de los casos reportados, con contraejemplos.
 * Fuentes: Gesenius-Kautzsch-Cowley §9u-v (kamats katán), §21 (begadkefat), §29 y §49h-m (perfecto consecutivo). */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const a=vm.runInNewContext(stub+extractEngine(html)+';({phonetize,readingNotices,mergeContextualNiqqud,begadkefatAlternative,endsInVowelSound,applyVisualMarks,hebrewForExport:typeof hebrewForExport==="function"?hebrewForExport:null});');
const both=(h,e,msg)=>{for(const x of [h.normalize('NFC'),h.normalize('NFD')])assert.equal(a.phonetize(x),e,msg||h);};
const kinds=t=>Array.from(a.readingNotices(t),n=>String(n.kind));

/* Sin listas: los mecanismos retirados no deben volver. */
for(const gone of ['REVIEWED_QAMATS_QATAN','QAMATZ_QATAN_FORMS','VAV_CONVERSIVE','bareLetters(src[at-1])==="כי"'])
  assert.ok(!html.includes(gone),'mecanismo retirado reapareció: '+gone);

/* 1. Kamats katán explícito U+05C7: siempre o. */
both('כׇּל','Kol');both('יִשְׁמׇר','Yishmor');
/* 2. Ante jataf kamats (§9v): o. Artículo/preposición con kamats ante gutural: a. */
both('פָּעֳלוֹ',"Po'oló");both('נָעֳמִי',"No'omí");both('הָאֳנִיָּה','Haoniyá');
/* 3. Shevá + daguesh kal = sílaba cerrada (§9u, §21): o. Shevá na (begadkefat rafe) o desinencia tónica del perfecto: a. */
both('קָרְבָּן','Korbán');both('כָּתְבוּ','Katevú');both('כּוֹנָנְתָּה','Konanta');both('וּבְשָׁכְבְּךָ','Uvshojbejá');
/* 4. Meteg sobre el kamats o rafé de shevá na en la letra siguiente prueban sílaba abierta: a. */
assert.match(a.phonetize('קָֽרְבָּן'),/^K[aá]r/u);assert.match(a.phonetize('קָרְֿבָּן'),/^K[aá]r/u);
/* 5. Makaf: la palabra pierde el acento (§9u): o. */
both('יִכְתָּב־שָׁם','Yijtov-sham');both('כָּל־הָעָם',"Kol-ha'am");
/* 6. Imperfecto CִCְCָC: ligado → o; pausa explícita → a; aislado → a por defecto + aviso; paradigma del texto → o. */
both('אִם יִזְכָּר אֱלֹהִים','Im yizkor Elohim');
both('וְלֹא יִלְמָד.','Veló yilmad.');
both('יִגְדָּל','Yigdal');assert.deepEqual(kinds('יִגְדָּל'),['qamats']);
both('יִזְכֹּר אֶת כׇּל\nיִזְכָּר','Yizkor et kol\nYizkor');assert.deepEqual(kinds('יִזְכֹּר אֶת כׇּל\nיִזְכָּר'),[]);
/* Contraejemplos: sufijo de sustantivo -ָם, participio nifal, gutural. */
both('וְהִנִּיחוּ יִתְרָם לְעוֹלְלֵיהֶם','Vehiniju yitram le\'olelehem');
both('לֵב נִשְׁבָּר וְנִדְכֶּה','Lev nishbar venidké');
both('יִשְׁאָל דָּבָר','Yishal davar');
assert.deepEqual(kinds('אִם יִזְכָּר אֱלֹהִים'),[]);
/* Infinitivo + sufijo e imperfecto + -ְךָ (sílaba cerrada, shevá muda tras katán). Contraejemplos: dos radicales, sustantivo con לִ. */
both('לְעָבְדוֹ',"Le'ovdó");both('בְּבָרְחוֹ','Bevorjó');both('בְּקָרְאִי','Bekorí');both('בְּדָבְרֶךָ','Bedovreja');both('יִשְׁמָרְךָ','Yishmorjá');
both('בְּיָדְךָ','Beyadejá');both('לִדְבָרְךָ','Lidvarejá');both('לְמָעְלָה',"Lema'elá");
both('לִשְׁמׇרְךָ','Lishmorjá');both('וְחׇנֵּנוּ','Vejonenu');
/* Sustantivos qotl siguen por la raíz léxica pendiente (documentado), no por un mapa del corpus. */
both('חָכְמָה','Jojmá');both('אָזְנְךָ','Oznejá');

/* 7. Begadkefat (§21): la fusión de Nakdan ya no reescribe frases; la regla ofrece la otra lectura. */
for(const src of ['כי בנו בחרת','כִּי בנו בחרת'])
  assert.equal(a.mergeContextualNiqqud(src,'כִּי בָּנוּ בָּחַרְתָּ').split(' ')[1],'בָּנוּ'.normalize('NFC'),'sin excepción de frase');
assert.equal(a.mergeContextualNiqqud('כִּי בָנוּ בָחַרְתָּ','כִּי בָּנוּ בָּחַרְתָּ'),'כִּי בָנוּ בָחַרְתָּ','el nikud del usuario manda');
assert.equal(a.begadkefatAlternative('פֶּלֶא','הוּא',' ').text,'פֶלֶא'.normalize('NFC'));
assert.equal(a.begadkefatAlternative('תוֹרָה','שִׂימוּ','\u05BE').text,'תּוֹרָה'.normalize('NFC'));
assert.equal(a.begadkefatAlternative('גְדוֹלָה','מְאֹד',' '),null,'tras consonante no hay alternativa');
assert.equal(a.begadkefatAlternative('בְּךָ','יְהֹוָה',' '),null,'tras el Nombre (Ad-nai) se mantiene el daguesh');
assert.equal(a.begadkefatAlternative('פֶּלֶא','הוּא',', '),null,'la puntuación es pausa');
for(const [w,v] of [['כִּי',true],['הוּא',true],['לְךָ',true],['עָלַי',false],['אַרְצָהּ',false],['שָׁלוֹם',false],['בָּנָיו',false]])
  assert.equal(a.endsInVowelSound(w),v,w);
/* El acento de -נוּ en la preposición no depende del daguesh (sandhi). */
both('בָּנוּ','Banu');both('בָנוּ','Vanu');both('לָנוּ','Lanu');both('קָנוּ','Kanú');

/* 8. Perfecto consecutivo (§49h-m). */
both('וְזָכַרְתָּ','Vezajartá');both('וְלָקַחְתָּ','Velakajtá');both('וּבָנִיתָ','Uvanitá');
both('וְזָכַרְתָּ.','Vezajarta.');                 // pausa explícita
both('וְזָכַֽרְתָּ','Vezajarta');                   // meteg explícito
both('וּמָצָאתִי','Umatsati');both('וְהִרְבֵּיתִי','Vehirbeti'); // ל״א 1.ª sg.; ל״ה no qal
both('זָכַרְתָּ אֶת הַבְּרִית וְשָׁמַרְתָּ אוֹתָהּ','Zajarta et haberit veshamarta otáh'); // cadena de pasado
both('שָׁמַרְתָּ: וְזָכַרְתָּ','Shamarta: vezajartá'); // la cita abre otro dominio
assert.deepEqual(kinds('וְזָכַרְתָּ'),['acento']);
assert.deepEqual(kinds('זָכַרְתָּ אֶת הַבְּרִית וְשָׁמַרְתָּ אוֹתָהּ'),['acento-pasado']);
/* Forma pausal escrita (kamats temático, §29k): sin desplazamiento. ArtScroll: וְשָׂבָֽעְתָּ (nivel 1). */
both('וְאָכַלְתָּ וְשָׂבָעְתָּ וּבֵרַכְתָּ',"Veajaltá vesava'ta uverajtá");
assert.ok(a.applyVisualMarks('וְאָכַלְתָּ וְשָׂבָעְתָּ וּבֵרַכְתָּ',{meteg:true}).includes('וְשָׂבָֽעְתָּ'.normalize('NFC')));
/* Meteg de ArtScroll en «כִּי בָֽנוּ בָחַֽרְתָּ» (nivel 1): mismo lugar que el acento del motor. */
assert.equal(a.applyVisualMarks('כִּי בָנוּ בָחַרְתָּ',{meteg:true}),'כִּי בָֽנוּ בָחַֽרְתָּ'.normalize('NFC'));
/* El meteg visual sale del mismo contexto que la fonética. */
assert.ok(a.applyVisualMarks('זָכַרְתָּ אֶת הַבְּרִית וְשָׁמַרְתָּ אוֹתָהּ',{meteg:true}).includes('וְשָׁמַֽרְתָּ'.normalize('NFC')));
assert.ok(!a.applyVisualMarks('וְזָכַרְתָּ',{meteg:true}).includes('\u05BD'));

/* 9. Copia y exportación conservan U+05C7. */
if(a.hebrewForExport){
  assert.equal(a.hebrewForExport('יִשְׁמׇר כׇּל'),'יִשְׁמׇר כׇּל');
  both(a.hebrewForExport('יִשְׁמׇר'),'Yishmor');
}else assert.ok(/function hebrewForExport\(s\)\{\s*return String\(s\)\s*\/\/ Vocal/u.test(html),'hebrewForExport sin conversión de U+05C7');
assert.ok(!/\.replace\(\/\\u05C7\/g, ?"\\u05B8"\)/u.test(html),'no queda conversión U+05C7 → U+05B8');
console.log('PASS: kamats katán por estructura y contexto, begadkefat como alternativa, perfecto consecutivo por regla, U+05C7 conservado');
