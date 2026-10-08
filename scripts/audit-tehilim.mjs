/**
 * Full-corpus mechanical audit of Tehilim 1-150.
 * Canonical text: JD System master, sourced from Wikisource and reviewed against ArtScroll.
 * Does NOT certify linguistic pronunciation accuracy.
 * Usage: node scripts/audit-tehilim.mjs [local-tehilim.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {extractEngine} from './extract-engine.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourceURL='https://raw.githubusercontent.com/judaicadesign/judaica-design-system/main/masters/tehilim/tehilim.json';
const corpusText=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):
  await (async()=>{const r=await fetch(sourceURL);if(!r.ok)throw Error('Canonical Wikisource master HTTP '+r.status);return r.text()})();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const setup=[
 "const _els=new Map();",
 "function node(){return {className:'',textContent:'',type:'',dataset:{},children:[],appendChild(x){this.children.push(x)},replaceChildren(){this.children=[]},addEventListener(){}}}",
 "function el(id){if(!_els.has(id))_els.set(id,{...node(),id,value:id==='nakdanGenre'?'rabbinic':'',scrollHeight:100,clientHeight:50,scrollTop:0,selectionStart:0,selectionEnd:0,addEventListener(){},focus(){},select(){},setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b}});return _els.get(id)}",
 "const document={getElementById:el,execCommand(){return true;},createElement(){return node()}};",
 "const window={addEventListener(){}};",
 "const navigator={clipboard:{writeText:async()=>{},readText:async()=>''}};",
 "const requestAnimationFrame=f=>f();"
].join('\n');
const engine=new Function(setup+extractEngine(html)+';return {wordOutput,runRegressionTests,runNakdanMergeRegressionTests};')();
const regressions=[...engine.runRegressionTests(),...engine.runNakdanMergeRegressionTests()];
const corpus=JSON.parse(corpusText);
if(!/Wikisource/.test(corpus.source))throw Error('Expected Wikisource canonical master');
const verses=corpus.items.flatMap(c=>c.verses.map(v=>({chapter:c.chapter,verse:v.verse,hebrew:v.hebrew})));
const chapters=new Set(),audits=[],flags={};
const niqqud=/[\u05B0-\u05BB\u05C7]/u,hebrew=/[\u05D0-\u05EA]/u;
const stripAccents=s=>s.replace(/[\u0591-\u05AF\u05BD]/gu,'');
let words=0,pointed=0;
function mark(row,k){row.flags.push(k);flags[k]=(flags[k]||0)+1;}
for(const v of verses){
 const {chapter,verse}=v;chapters.add(chapter);
 for(const m of v.hebrew.matchAll(/[\u05D0-\u05EA\u0591-\u05C7\u200d]+/gu)){
  const source=m[0];
  if(!hebrew.test(source))continue; // Nun hafukha and standalone marks are punctuation.
  const output=engine.wordOutput(source);
  const row={chapter,verse,hebrew:source,phonetic:output,flags:[]};
  words++;if(niqqud.test(source))pointed++;
  if(!output||hebrew.test(output))mark(row,'incomplete_output');
  if((source.match(/ע/g)||[]).length!==(output.match(/'/g)||[]).length)
    mark(row,'ayin_apostrophe_mismatch');
  if(/g[eiéí]/i.test(output))mark(row,'hard_g_spelling');
  if(engine.wordOutput(stripAccents(source))!==output)mark(row,'cantillation_leak');
  audits.push(row);
 }
}
if(chapters.size!==150||verses.length!==2527)
 throw Error('Incomplete corpus: '+chapters.size+' chapters / '+verses.length+' verses');
const out=path.join(root,'audit-results');fs.mkdirSync(out,{recursive:true});
const csv=x=>'"'+String(x??'').replaceAll('"','""')+'"';
const lines=[['salmo','versiculo','hebreo','fonetica','flags'].map(csv).join(',')];
for(const r of audits)lines.push([r.chapter,r.verse,r.hebrew,r.phonetic,r.flags.join('|')].map(csv).join(','));
fs.writeFileSync(path.join(out,'tehilim-all-words.csv'),lines.join('\n'),'utf8');
const summary={
  source:'JD canonical master: Wikisource with documented ArtScroll reviews',
  sourceURL,chapters:chapters.size,verses:verses.length,wordTokens:words,pointedTokens:pointed,
  uniqueForms:new Set(audits.map(x=>x.hebrew)).size,
  technicalFlags:flags,regressionFailures:regressions,
  flaggedSamples:audits.filter(x=>x.flags.length).slice(0,100),
  certifiedPronunciationAccuracy:false,
  note:'Mechanical invariants do not demonstrate 99.99% pronunciation accuracy.'
};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2),'utf8');
console.log(JSON.stringify({
  chapters:summary.chapters,verses:summary.verses,wordTokens:words,
  uniqueForms:summary.uniqueForms,technicalFlags:flags,regressionFailures:regressions.length
},null,2));
if(regressions.length)process.exitCode=1;
