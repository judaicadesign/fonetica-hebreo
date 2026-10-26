// Correcciones del 26/10/2026 (aprobadas por el titular): reglas, con prefijos y contraejemplos.
// Origen: fonética del Birkat Hamazón ashkenazí generada desde el hebreo aprobado (cotejo ArtScroll 25/10).
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const cases=[
 // 1. Artículo + palabra en -ָה: milrá. El imperativo Hifil (jirik antes de la última radical) sigue milel.
 ['הַקְּדוֹשָׁה','Hakedoshá'],['הַפְּתוּחָה','Hapetujá'],['הַשְּׁדוּדָה','Hashedudá'],['הַגְּדוֹלָה','Haguedolá'],
 ['הַקְּֿדוֹשָׁה','Hakedoshá'],['וְהַקְּדוֹשָׁה','Vehakedoshá'],
 ['הַקְשִׁיבָה','Hakshiva'],['הַאֲזִינָה','Haazina'],['הוֹשִׁיעָה',"Hoshi'a"],
 // 2. Dagesh fuerte en la 2ª radical: no es segolado (Piel): milrá. Segolados verdaderos siguen milel.
 ['שֶׁיְּשַׁלֶּם','Sheyeshalem'],['וִיבַשֶּׂר','Vivaser'],['אֶקַּח','Ekaj'],
 ['אֶרֶץ','Érets'],['דֶּרֶךְ','Dérej'],['בְּחֶסֶד','Bejésed'],['בַּיִת','Báyit'],['אַתֶּם','Atem'],['תַּחֲזִירֶנָּה','Tajazirena'],
 // 3. Piel imperfecto 3mp en forma de contexto (shevá): milrá. La pausal con tseré y meteg sigue milel.
 ['יְלַמְּדוּ','Yelamedú'],['יְדַבְּרוּ','Yedaberú'],['יְדַבֵּֽרוּ','Yedaberu'],
 // 4. -תִי de preposición/sustantivo es tónico; el perfecto 1ª sg. sigue átono.
 ['אוֹתִי','Otí'],['אִתִּי','Ití'],['אִשְׁתִּי','Ishtí'],['שָׁמַרְתִּי','Shamarti'],['הָיִיתִי','Hayiti'],
 // 5. Preposición + sufijo -ךָ con vav: milrá como lejá. El sustantivo con -ְךָ sigue su regla.
 ['וּלְךָ','Uljá'],['לְךָ','Lejá'],['בֵּיתְךָ','Betejá'],
 // 6. Qamats katan en geminado + -ֵּנוּ/-ֵּנִי.
 ['וְחָנֵּנוּ','Vejonenu'],['חָנֵּנִי','Joneni'],['יְחָנֵּנוּ','Yejonenu'],['כָּל','Kol'],
 // 7. Consonante sin vocal ante א quiescente (Tehilim 34:10).
 ['יְראוּ','Yirú'],['יִרְאוּ','Yirú'],['יִרְאָה','Yirá'],
 // 8. RAE: llana en dos consonantes con tilde; aguda en dos consonantes sin tilde.
 ['וְנִפֵּץ','Venipets'],['הָאָרֶץ','Haárets'],
];
for(const [h,e] of cases){assert.equal(api.phonetize(h),e,h);assert.equal(api.phonetize(h.normalize('NFD')),e,h+' NFD');}
// 9. Mayúscula reverencial de pronombres por contexto de la oración.
const s=t=>api.phonetize(t);
assert.match(s('וְעַל הַכֹּל יְיָ אֱלֹהֵינוּ אֲנַחְנוּ מוֹדִים לָךְ וּמְבָרְכִים אוֹתָךְ.'),/modim Laj umvarejim Otaj\./);
assert.match(s('וּבֵרַכְתָּ אֶת יְיָ אֱלֹהֶיךָ עַל הָאָרֶץ הַטֹּבָה אֲשֶׁר נָתַן לָךְ.'),/natán laj\./, '«tu D\'s»: el tú es la persona');
assert.match(s('חוּס וְחָנֵּנוּ וְרַחֵם עָלֵינוּ, כִּי אֵלֶיךָ עֵינֵינוּ, כִּי אֵל מֶלֶךְ חַנּוּן וְרַחוּם אָתָּה.'),/ki Eleja 'enenu/);
assert.match(s('לֹא יִהְיֶה בְךָ אֵל זָר.'),/vejá/, 'אֵל זָר no es Hashem');
assert.match(s('וְאָמַרְתִּי אֶל הַמֶּלֶךְ לְךָ.'),/ lejá\./, 'אֶל preposición no es nombre divino');
console.log('PASS: acento con artículo y dagesh fuerte, Piel 3mp, -ti tónico, uljá, qamats katan (jonenu), Yirú, RAE y pronombres reverenciales (26/10)');
