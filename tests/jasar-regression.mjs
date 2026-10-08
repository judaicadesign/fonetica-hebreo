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
for(const [input,expected] of [['חָסַר','Jásar'],['חָֽסַר','Jásar'],['לֹא חָסַר לָנוּ','Lo jásar lanu'],['לֹא חָֽסַר לָנוּ','Lo jásar lanu'],['יַחְסְרוּ','Yajserú']]){
 const actual=api.phonetize(input);if(actual!==expected)failures.push(`${input} -> ${actual}; expected ${expected}`);
}
if(failures.length){console.error(failures);process.exitCode=1;}else console.log('PASS: internal regressions and jásar with/without meteg; related form preserved.');
