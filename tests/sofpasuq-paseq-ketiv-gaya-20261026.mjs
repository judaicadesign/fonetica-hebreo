// Correcciones del 26/10/2026 (aprobadas por el titular: «sí, corregilo»). Reglas, con contraejemplos.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const s=t=>api.phonetize(t);
// 1. Sof pasuq = punto, y la palabra siguiente arranca oración.
assert.equal(s('יוֹם הַשִּׁשִּׁי׃ וַיְכֻלּוּ הַשָּׁמַיִם'),'Yom hashishí. Vaijulú hashamáyim');
// 2. Paseq: pausa sin sonido.
assert.equal(s('אֱלֹהִים אֵלִי ׀ אַתָּה'),'Elohim elí Atá');
// 3. Sin nikud queda en hebreo, también letras sueltas y abreviaturas; las rúbricas conocidas se siguen traduciendo.
assert.equal(s('(נדרים כב ע"א)'),'(נדרים כב ע"א)');
assert.equal(s('ד שְׁמַע יִשְׂרָאֵל'),'ד shemá\' Yisrael');
assert.equal(s('בלחש: וַיְהִי'),'En voz baja: Vaihí');
// 4. Ketiv junto a su qeré: no se lee. Una rúbrica que no se parece a la palabra vecina queda.
assert.equal(s('מַה יָּגֶל יגיל מְאֹד'),'Ma yáguel meod');
assert.equal(s('יֻצָּֽרוּ ולא וְלוֹ אֶחָד'),'Yutsaru veló ejad');
assert.match(s('אִם חָכָם אוֹ עָשִׁיר הוּא – עָלֶיךָ לְכַבְּדוֹ; ואם'),/ואם/);
// 5. Meteg sobre el pataj del artículo/preposición ante dagesh fuerte = ga'ya (Tehilim 1:4 FINAL); con qamats sigue marcando la tónica.
assert.equal(s('כִּי אִם כַּֽמֹּץ אֲשֶׁר'),'Ki im kamots asher');
assert.equal(s('כַּמֹּץ'),'Kamots');
assert.equal(s('נָֽפְלוּ'),'Náfelu');
assert.equal(s('לֹא כֵן הָרְשָׁעִים, כִּי אִם כַּֽמֹּץ אֲשֶׁר תִּדְּפֶֽנּוּ רוּחַ.'),"Lo jen haresha'im, ki im kamots asher tidefenu rúaj.");
// 6. RAE: aguda terminada en vocal + s lleva tilde también en la tabla sefaradí (yifrós, como Tifrós y Ufrós).
assert.equal(s('הָרַחֲמָן הוּא יִפְרוֹשׂ עָלֵֽינוּ'),"Harajamán Hu yifrós 'alenu");
// 7. Segolado constructo solo pegado a la palabra siguiente: con punto en el medio conserva su acento.
assert.match(s('בְּנַֽחַת וְלֹא בְצַעַר. הָרַחֲמָן הוּא'),/veló vetsá'ar\. Harajamán/);
assert.match(s('בַּעַל הַנֶּחָמוֹת'),/ba'al hanejamot/i);
// 8. Las rúbricas se traducen solo como palabra entera.
assert.match(s('אין אומרים בשבתות וימים טובים: יְהִי רָצוֹן'),/בשבתות/);
assert.match(s('בשבת: רְצֵה'),/^En Shabat: Retsé/);
console.log('PASS: sof pasuq, paseq, letras sin nikud, ketiv y ga\'ya del artículo (26/10)');
