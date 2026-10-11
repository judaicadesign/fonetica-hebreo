/** Judaica Design® – diagnostic of live Tehilim 14 vs the production phonetic engine.
 * Non-mutating. Corpus source is JD GitHub canonical; does not approve chapters.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const corpusURL='https://raw.githubusercontent.com/judaicadesign/judaica-design-system/main/masters/tehilim/tehilim.json';
const response=await fetch(corpusURL,{cache:'no-store',signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error('Cannot read JD corpus '+response.status);
const corpus=await response.json();
const psalm=corpus.items.find(c=>c.chapter===14);
if(!psalm||psalm.verses.length!==7)throw Error('Psalm 14 not 7 verses');
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const {phonetize}=vm.runInNewContext(stub+source+';({phonetize});',{}, {timeout:20000});
const rows=psalm.verses.map(v=>({verse:v.verse,hebrew:v.hebrew,master:v.phonetic,generator:phonetize(v.hebrew),match:phonetize(v.hebrew)===v.phonetic}));
const mismatches=rows.filter(x=>!x.match);
const summary={chapter:14,sourceURL:corpusURL,generatorSha:process.env.GITHUB_SHA||null,checkedVerses:7,matchingVerses:7-mismatches.length,mismatches};
fs.mkdirSync('audit-results',{recursive:true});
fs.writeFileSync('audit-results/psalm-014-live-generator.json',JSON.stringify({summary,verses:rows},null,2)+'\n');
console.log('PSALM_14_LIVE_COMPARISON '+JSON.stringify(summary));
if(mismatches.length)throw Error('Generator differs from Psalm 14 FINAL on '+mismatches.map(x=>x.verse).join(','));
