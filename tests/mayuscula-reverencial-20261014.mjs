/** Mayúscula reverencial y nombres propios POR REGLA (decisiones 14/10/2026), sin tablas de palabras. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const a=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});',{}, {timeout:20000});
const cases=[
 // Títulos y epítetos
 ['בָּרוּךְ הוּא וּבָרוּךְ שְׁמוֹ.','Baruj Hu uvaruj Shemó.'],
 ['אָבִינוּ מַלְכֵּנוּ אַדִּירֵנוּ','Avinu Malkenu Adirenu'],
 ['אַבְרָהָם אָבִינוּ','Avraham avinu'],
 ['כִּי מֶלֶךְ כָּל הָאָרֶץ אֱלֹהִים','Ki Mélej kol haárets Elohim'],
 // Homógrafos por niqqud
 ['לֹא שָׂמוּ אֱלֹהִים','Lo samu Elohim'],
 ['אַל תִּירָא','Al tirá'],
 ['בְּיָמֵינוּ','Beyamenu'],
 ['שָׁם יָשַׁבְנוּ','Sham yashavnu'],
 // Shem solo en fórmula; «beshem / uvshem» en minúscula
 ['וּבָרוּךְ שֵׁם כְּבוֹדוֹ לְעוֹלָם','Uvaruj Shem kevodó le\'olam'],
 ['וְלֹא יִזָּכֵר שֵׁם יִשְׂרָאֵל עוֹד','Veló yizajer shem Yisrael \'od'],
 // Hu cópula
 ['לְחֹדֶשׁ שְׁנֵים עָשָׂר, הוּא חֹדֶשׁ אֲדָר','Lejódesh shenem \'asar, hu jódesh Adar'], // 25/10: sin tilde (aguda en m),
 // Fiestas, Shabat, Mashíaj, nombres propios
 ['רֹאשׁ הַחֹדֶשׁ חַג הַמַּצּוֹת','Rosh Hajódesh Jag Hamatsot'],
 ['אִסְרוּ חַג בַּעֲבֹתִים','Isrú jag ba\'avotim'],
 ['זֶה יוֹם הַשַּׁבָּת','Ze yom haShabat'],
 ['בִּימֵי מָרְדְּכַי וְאֶסְתֵּר בְּשׁוּשַׁן הַבִּירָה','Bimé Mordejái veEster beShushán habirá'],
 // Homógrafos de nombres (clase D)
 ['נָתַן לֶחֶם','Natán léjem'.replace('N','n').replace(/^n/,'N')],
];
for(const [h,e] of cases)assert.equal(a.phonetize(h),e,h);
assert.match(a.phonetize('אֲשֶׁר נָתַן לָנוּ'),/ natán /,'נָתַן verbo en minúscula');
assert.match(a.phonetize('הוּא נוֹתֵן לֶחֶם'),/ notén /,'נוֹתֵן no es el profeta Natán');
console.log('PASS: mayúscula reverencial por regla (títulos, fórmulas, homógrafos por niqqud, fiestas, Shabat, nombres)');
