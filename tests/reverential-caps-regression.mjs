import fs from 'node:fs';
import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const source=extractEngine(html);
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}},execCommand(){return true}};const window={addEventListener(){}};const navigator={clipboard:{writeText(){}}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+source+';({phonetize,runRegressionTests});',{}, {timeout:20000});
const failures=api.runRegressionTests();
const cases=[
 ['בָּרוּךְ אַתָּה יְיָ','Baruj Atá Ad-nai'],
 ['בָּרוּךְ אַתָּה יהוה','Baruj Atá Ad-nai'],
 ['בָּרוּךְ אַתָּה אֲדֹנָי','Baruj Atá Ad-nai'],
 ['כָּאָמוּר: פּוֹתֵחַ אֶת יָדֶךָ','Kaamur: potéaj et Yadeja'],
 ['פּוֹתֵֽחַ אֶת יָדֶֽךָ','Potéaj et Yadeja'],
 ['רָאִיתִי אֶת יָדֶךָ','Raíti et yadeja'],
 ['רַחֲמִים','Rajamim'],['לְעוֹלָם',"Le'olam"],['רָאִיתִי','Raíti']
];
for(const [input,expected] of cases){
 const actual=api.phonetize(input);if(actual!==expected)failures.push(`${input} -> ${actual}; expected ${expected}`);
}
const human=api.phonetize('בְּנִי אַתָּה אֲנִי');
if(/At[áa]/u.test(human))failures.push('Human addressee was capitalized: '+human);
if(failures.length){console.error(failures);process.exitCode=1;}else console.log('PASS: reverential capitals, human counterexamples, and rajamim/leolam/raiti spelling.');
