/** Decisiones del 14/10/2026: meteg de entrada como acento, Bavél, opción C de "ah", jolam faltante, CaYiC. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const {phonetize}=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const cases=[
 ['כִּי אֵל מֶֽלֶךְ חַנּוּן וְרַחוּם אָֽתָּה','Ki El Mélej janún verajum Ata'],   // meteg en la א manda
 ['כִּי אֵל מֶלֶךְ חַנּוּן וְרַחוּם אָתָּה','Ki El Mélej janún verajum Ata'],     // forma pausal con qamats
 ['אַתָּה','Atá'],
 ['שִֽׁירוּ','Shiru'],                                                           // llana: acento en shi (sin tilde)
 ['שִׁירוּ','Shirú'],
 ['וּלְהוֹשִׁיעֵֽנוּ','Ulehoshi\'enu'],
 ['בָּבֶל','Bavél'],['בְּבָבֶל','BeVavél'],['וּבְבָבֶל','UveVavél'],
 ['מִצִּיּוֹן','MiTsiyón'],
 ['לְתוֹכָהּ','Letojáh'],['מִטּוּבָהּ','Mituváh'],['מִפִּרְיָהּ','Mipiryáh'],['בִּנְיָנָהּ','Binyanáh'],['לִשְׁמָהּ','Lishmáh'],
 ['הַלְלוּיָהּ','HaleluYah'],['בְּיָהּ','BeYah'],
 ['אַתֶּם','Atem'],['מְבַקֵּשׁ','Mevakesh'],
 ['אֱלֹהֵינוּ וֵאלהֵי אֲבוֹתֵינוּ','Elohenu vElohé avotenu'],
 ['בַּיִת','Báyit'],['עַיִן','\'Ayin'],['עַֽיִן','\'Ayin'],
 ['יְהֹוָה אֱלֹהַי בְּךָ חָסִֽיתִי הוֹשִׁיעֵֽנִי מִכׇּל רֹדְפַי וְהַצִּילֵֽנִי.','Ad-nai Elohái Bejá jasiti hoshi\'eni mikol rodefái vehatsileni.'],
];
for(const [h,e] of cases)for(const x of [h,h.normalize('NFD')])assert.equal(phonetize(x),e,h);
console.log('PASS: '+cases.length+' decisiones del 14/10 (meteg de entrada, Bavél, "ah" opción C, jolam faltante, CaYiC)');
