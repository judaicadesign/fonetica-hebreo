/** Decisiones del 14/10/2026: meteg de entrada como acento, Bavél, opción C de "ah", jolam faltante, CaYiC. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const {phonetize,applyVisualMarks}=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize,applyVisualMarks});');
const cases=[
 ['כִּי אֵל מֶֽלֶךְ חַנּוּן וְרַחוּם אָֽתָּה','Ki El Mélej janún verajum Ata'],   // meteg en la א manda
 ['כִּי אֵל מֶלֶךְ חַנּוּן וְרַחוּם אָתָּה','Ki El Mélej janún verajum Ata'],     // forma pausal con qamats
 ['אַתָּה','Atá'],
 ['שִֽׁירוּ','Shiru'],                                                           // llana: acento en shi (sin tilde)
 ['שִׁירוּ','Shirú'],
 ['וּלְהַעֲבִירָם','Ulha\'aviram'],
 ['וּלְהוֹשִׁיעֵנוּ','Ulhoshi\'enu'],
 ['וּלְהוֹשִׁיעֵֽנוּ','Ulhoshi\'enu'],
 ['וּלְבִנְיַן','Ulvinyán'],
 // Posesivo -ֶיהָ: penúltima sílaba, también con prefijos; sin excepciones por palabra.
 ['בָּנֶיהָ','Baneha'],['בָּנֶֽיהָ','Baneha'],
 ['בְּבָנֶיהָ','Bevaneha'],['בְּבָנֶֽיהָ','Bevaneha'],
 ['מִגְדָּלֶיהָ','Migdaleha'],['בְּנוֹתֶיהָ','Benoteha'],
 ['עָלֶיהָ',"'Aleha"],['בָּנֶיךָ','Baneja'],['בִּנְיָנָהּ','Binyanáh'],
 ['בָּבֶל','Bavél'],['בְּבָבֶל','BeVavél'],['וּבְבָבֶל','UveVavél'],
 ['מִצִּיּוֹן','MiTsiyón'],
 ['לְתוֹכָהּ','Letojáh'],['מִטּוּבָהּ','Mituváh'],['מִפִּרְיָהּ','Mipiryáh'],['בִּנְיָנָהּ','Binyanáh'],['לִשְׁמָהּ','Lishmáh'],
 ['הַלְלוּיָהּ','HaleluYah'],['בְּיָהּ','BeYah'],
 ['אַתֶּם','Atem'],['מְבַקֵּשׁ','Mevakesh'],
 ['אֱלֹהֵינוּ וֵאלהֵי אֲבוֹתֵינוּ','Elohenu vElohé avotenu'],
 ['בַּיִת','Báyit'],['עַיִן','\'Ayin'],['עַֽיִן','\'Ayin'],
 ['יְהֹוָה אֱלֹהַי בְּךָ חָסִֽיתִי הוֹשִׁיעֵֽנִי מִכׇּל רֹדְפַי וְהַצִּילֵֽנִי.','Ad-nai Elohái Bejá jasiti hoshi\'eni mikol rodefái vehatsileni.'],
 ['מַתְּנוֹת','Matenot'],['מַתְּֿנוֹת','Matenot'],                               // shevá na (rafe en la entrada)
 ['לְעוֹלָם בְּעֹשֶׁר וְכָבוֹד מֵעַתָּה וְעַד','Le\'olam be\'ósher vejavod me\'atá ve\'ad'],
 ['יְיָ יְבָרֵךְ אֶת עַמּוֹ','Ad-nai yevarej et \'amó'],                           // su pueblo: minúscula
 ['סֻכַּת דָּוִיד','Sukat David'],
 ['בְּסֻוכּוֹת: הָרַחֲמָן הוּא','Besuvkot: Harajamán Hu'],
 ['וְאַתָּה בְּרַחֲמֶֽיךָ הָרַבִּים','VeAtá berajameja harabim'],                  // Atá = Hashem por contexto
 ['בֵּית הַמִּקְדָּשׁ','Bet haMikdash'],
 ['וְעַל הַכֹּל יְיָ אֱלֹהֵינוּ מוֹדִים לָךְ','Ve\'al hakol Ad-nai Elohenu modim Laj'],['יִתֶּן לְךָ כִלְבָבֶךָ','Yitén lejá jilvaveja'],['אֲשֶׁר לֹא הָלַךְ','Asher lo halaj'],['וּלְאֻמִּים','Ulumim'],['לְאֻמִּים','Leumim'],
 ['עַל הַבַּיִת הַגָּדוֹל וְהַקָּדוֹשׁ','\'Al haBáyit hagadol vehakadosh'],
 ['כִּי אַתָּה הוּא בַּעַל הַנֶּחָמוֹת','Ki Atá Hu ba\'al hanejamot'],
];
for(const [h,e] of cases)for(const x of [h,h.normalize('NFD')])assert.equal(phonetize(x),e,h);
// La casilla Meteg debe marcar la vocal de la sílaba tónica sin modificar la fonética.
for(const [plain,marked] of [
 ['בָּנֶיהָ','בָּנֶֽיהָ'],
 ['בְּבָנֶיהָ','בְּבָנֶֽיהָ'],
 ['מִגְדָּלֶיהָ','מִגְדָּלֶֽיהָ'],
 ['בְּנוֹתֶיהָ','בְּנוֹתֶֽיהָ'],
 ['עָלֶיהָ','עָלֶֽיהָ'],
]){
 for(const w of [plain,plain.normalize('NFD')]){
  assert.equal(applyVisualMarks(w,{meteg:true}).normalize('NFC'),marked.normalize('NFC'),plain+' meteg');
  assert.equal(phonetize(applyVisualMarks(w,{meteg:true})),phonetize(w),plain+' invariancia de lectura');
 }
}
assert.equal(applyVisualMarks('בִּנְיָנָהּ',{meteg:true}), 'בִּנְיָנָהּ','no añadir meteg a otra terminación');
console.log('PASS: '+cases.length+' decisiones del 14/10 (meteg de entrada, Bavél, "ah" opción C, jolam faltante, CaYiC)');
