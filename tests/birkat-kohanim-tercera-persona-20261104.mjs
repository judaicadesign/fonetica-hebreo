// 04/11/2026 (pedido del titular): Bendición Sacerdotal / Birkat habanim.
// Regla: si la oración nombra a Hashem en TERCERA persona (nombre divino junto a un sustantivo con
// sufijo de 3.ª persona que lo refiere: יְיָ פָּנָיו «Su rostro», שְׁמוֹ, יָדוֹ…), el «tú» de
// לְךָ / אֵלֶיךָ / בְּךָ / אוֹתְךָ es la persona bendecida, no Hashem: minúscula.
// Contraejemplos: cuando se le habla a Hashem (2.ª persona) la mayúscula se mantiene.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const s=t=>api.phonetize(t);

// Birkat Kohanim tal como figura en los másters (líneas y versículo continuo)
const bk=s('יְבָרֶכְךָ יְיָ וְיִשְׁמְרֶךָ.\nיָאֵר יְיָ פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ.\nיִשָּׂא יְיָ פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם.');
assert.match(bk,/Yaer Ad-nai Panav eleja vijuneka/,'eleja = la persona bendecida');
assert.match(bk,/Yisá Ad-nai Panav eleja veyasem lejá shalom/,'eleja y lejá en minúscula; Panav (Su rostro) sigue con mayúscula');
assert.doesNotMatch(bk,/Eleja|Lejá/);
// Versión de la captura: coma al final de la línea y todo en una oración
const cap=s('יְבָרֶכְךָ יְיָ וְיִשְׁמְרֶךָ, יָאֵר יְיָ פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ,\nיִשָּׂא יְיָ פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם.');
assert.doesNotMatch(cap,/Eleja|Lejá/);
assert.match(cap,/Panav eleja/);
// Con sof pasuk (׃) como en Kriat Shemá al Hamitá
assert.doesNotMatch(s('יָאֵר יְיָ פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ׃ יִשָּׂא יְיָ פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם׃'),/Eleja|Lejá/);

// Contraejemplos: se le habla a Hashem → mayúscula se mantiene
assert.match(s('חוּס וְחָנֵּנוּ וְרַחֵם עָלֵינוּ, כִּי אֵלֶיךָ עֵינֵינוּ, כִּי אֵל מֶלֶךְ חַנּוּן וְרַחוּם אָתָּה.'),/ki Eleja 'enenu/);
assert.match(s('נוֹדֶה לְּךָ יְיָ אֱלֹהֵינוּ.'),/Lejá Ad-nai/);
assert.match(s('זָעַקְתִּי אֵלֶיךָ יְיָ.'),/Eleja Ad-nai/);
// «Panav» sin nombre divino al lado (17:13 = el enemigo) no activa la regla ni se capitaliza
assert.doesNotMatch(s('קַדְּמָה פָנָיו הַכְרִיעֵהוּ.'),/Panav/);
console.log('PASS: Birkat Kohanim — Hashem en 3.ª persona (Panav): eleja / lejá de la persona bendecida en minúscula; contraejemplos en 2.ª persona conservan la mayúscula (04/11)');
