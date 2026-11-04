// 04/11/2026 (pedido del titular): Birkat habanim para hijas.
// Nombres que también son palabras comunes (שָׂרָה, לֵאָה) llevan mayúscula con prefijo cuando están
// junto a otro nombre propio. Sin un nombre al lado siguen bloqueados (כְּשֵׁרָה «kosher»).
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({phonetize});');
const s=t=>api.phonetize(t);
assert.equal(s('יְשִׂימֵךְ אֱלֹהִים כְּשָׂרָה רִבְקָה רָחֵל וְלֵאָה'),'Yesimej Elohim keSará Rivká Rajel veLeá');
assert.match(s('יְשִׂימֵךְ אֱלֹהִים כְּשָׂרָה רִבְקָה רָחֵל וְלֵאָה.'),/keSará Rivká Rajel veLeá\./);
// Sin nombre al lado: sigue siendo palabra común
assert.doesNotMatch(s('וְהִיא אִשָּׁה כְּשֵׁרָה.'),/[A-Z]sh?er/);
assert.doesNotMatch(s('וַתִּהְיֶה נַפְשׁוֹ וְלֵאָה.'),/veLeá/);
// מָלְאָה «llena» no es prefijo + Leá, aunque haya un nombre al lado
assert.match(s('דָּוִד מָלְאָה.'),/David maleá\./);
assert.match(s('חֶֽסֶד יְהֹוָה מָלְֿאָה הָאָֽרֶץ.'),/maleá haárets/);
// Varón: Efráyim y Menashé no cambian
assert.match(s('יְשִׂימְךָ אֱלֹהִים כְּאֶפְרַיִם וְכִמְנַשֶּׁה.'),/keEfráyim vejiMnashé\./);
console.log('PASS: Imahot con prefijo junto a otro nombre (keSará, veLeá); homógrafos sin nombre al lado siguen en minúscula (04/11)');
