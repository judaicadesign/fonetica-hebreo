/**
 * Snapshot actual output of the canonical generator for Tehilim 8–12.
 * This is a DIAGNOSTIC ONLY: never modifies or approves editorial masters.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import {extractEngine} from '../scripts/extract-engine.mjs';
const corpusUrl='https://raw.githubusercontent.com/judaicadesign/judaica-design-system/main/masters/tehilim/tehilim.json';
const res=await fetch(corpusUrl,{signal:AbortSignal.timeout(30000)});
if(!res.ok)throw Error('Corpus fetch HTTP '+res.status);
const corpus=await res.json();
const source=extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const {phonetize}=vm.runInNewContext(stub+source+';({phonetize});',{}, {timeout:20000});
const targets=[['9:21','שִׁיתָה'],['9:21','הֵמָּה'],['10:3','בֵּרֵךְ'],['11:3','פָּעָל']];
const output={timestamp:new Date().toISOString(),corpusUrl,sourceSha:process.env.GITHUB_SHA||'unknown',chapters:[],questions:[]};
const normalizedTokens=s=>s.match(/[\\p{L}\\p{M}'’\-]+/gu)||[];
for(const c of corpus.items.filter(c=>c.chapter>=8&&c.chapter<=12)){
 const report={chapter:c.chapter,verses:c.verses.length,differences:[],verseResults:[]};
 for(const v of c.verses){
  const actual=phonetize(v.hebrew);
  const ref=c.chapter+':'+v.verse;
  report.verseResults.push({ref,hebrew:v.hebrew,generatorActual:actual,masterProvisional:v.phonetic});
  if(actual!==v.phonetic)report.differences.push({ref,generatorActual:actual,masterProvisional:v.phonetic});
  for(const [target,word] of targets.filter(x=>x[0]===ref)){
   const hw=v.hebrew.match(/[\\u05D0-\\u05EA\\u0591-\\u05C7\\u200d]+/gu)||[];
   const index=hw.indexOf(word);
   if(index<0)throw Error('Missing question word '+ref+' '+word);
   const phones=actual.match(/[^\\s,.;:!?]+/gu)||[];
   output.questions.push({ref,word,previousWord:hw[index-1]||null,nextWord:hw[index+1]||null,wordIndex:index,generatorActualWord:phones[index]||null,generatorActualVerse:actual});
  }
 }
 output.chapters.push(report);
}
const out='audit-results';
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(out+'/artscroll-008-012-generator.json',JSON.stringify(output,null,2)+'\\n');
console.log('ARTSCROLL_8_12_AUDIT '+JSON.stringify({chapters:output.chapters.map(x=>({chapter:x.chapter,verses:x.verses,differenceCount:x.differences.length})),questions:output.questions}));
