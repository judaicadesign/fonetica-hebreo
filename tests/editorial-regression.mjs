/*
 * Judaica Design: editorial regression runner (Node 20+, no dependencies).
 * Run: node tests/editorial-regression.mjs
 *
 * This is a deterministic OFFLINE check of the phonetics engine only.
 * It does not test the live Nakdan service or claim 99.99% accuracy.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(base,"index.html"),"utf8");
const start=html.lastIndexOf("<script>");
const end=html.lastIndexOf("</script>");
if(start<0 || end<start) throw new Error("Missing inline phonetics script in index.html");
const source=html.slice(start+"<script>".length,end);

const bootstrap=`
const _els=new Map();
function _node(){
  return {
    className:"",textContent:"",type:"",dataset:{},children:[],
    appendChild(x){this.children.push(x)},
    replaceChildren(){this.children=[]},
    addEventListener(){}
  };
}
function _el(id){
  if(!_els.has(id)) _els.set(id,{
    ..._node(),id,value:id==="nakdanGenre"?"rabbinic":"",
    scrollHeight:100,clientHeight:50,scrollTop:0,
    selectionStart:0,selectionEnd:0,
    focus(){},select(){},setSelectionRange(){}
  });
  return _els.get(id);
}
const document={getElementById:_el,createElement(){return _node()},execCommand(){return true}};
const window={addEventListener(){}};
const navigator={clipboard:{writeText:async()=>{},readText:async()=>""}};
const requestAnimationFrame=fn=>fn();
`;

const api=vm.runInNewContext(
  bootstrap+source+"\n;({phonetize,runRegressionTests,runNakdanMergeRegressionTests});",
  {},
  {timeout:20000,filename:"index.html inline script"}
);
const fixtures=JSON.parse(fs.readFileSync(path.join(base,"tests","editorial-cases.json"),"utf8"));
if(fixtures.schema_version!==1 || !Array.isArray(fixtures.cases)) throw new Error("Invalid editorial fixture schema");

const errors=[];
const builtIn=api.runRegressionTests();
if(builtIn.length) errors.push(...builtIn.map(x=>"Existing regression: "+x));
const nakdanMerge=api.runNakdanMergeRegressionTests();
if(nakdanMerge.length) errors.push(...nakdanMerge.map(x=>"Nakdan merge: "+x));

const groups=new Map();
for(const [i,entry] of fixtures.cases.entries()){
  const got=api.phonetize(entry.hebrew);
  if(got!==entry.expected){
    errors.push("Editorial case "+(i+1)+": "+JSON.stringify(entry.hebrew)+
      " -> "+JSON.stringify(got)+"; expected "+JSON.stringify(entry.expected));
  }
  if(entry.group){
    const key=entry.group+"\u0000"+entry.hebrew;
    const previous=groups.get(key);
    if(previous && previous!==got){
      errors.push("Cross-nusach mismatch: "+entry.group+" "+JSON.stringify(entry.hebrew));
    }
    groups.set(key,got);
  }
}
// La cantilación y el meteg de la fuente masorética no deben cambiar
// la pronunciación editorial de una misma cadena vocalizada.
for(const [i,entry] of fixtures.cases.entries()){
  const v=entry.hebrew.match(/[\u05B0-\u05BB\u05C7]/u);
  if(!v) continue;
  const at=v.index+v[0].length;
  const meteg=entry.hebrew.slice(0,at)+"\u05BD"+entry.hebrew.slice(at);
  const taam=entry.hebrew.slice(0,at)+"\u0591"+entry.hebrew.slice(at);
  for(const [label,marked] of [["meteg",meteg],["taam",taam]]){
    const got=api.phonetize(marked);
    if(got!==entry.expected) errors.push(
      "Masoretic invariant "+label+" editorial case "+(i+1)+": "+
      JSON.stringify(marked)+" -> "+JSON.stringify(got)+
      "; expected "+JSON.stringify(entry.expected));
  }
}
// Contraejemplo: niqqud realmente distinto puede cambiar pronunciación.
if(api.phonetize("חַדֵּשׁ")===api.phonetize("חָדָשׁ")){
  errors.push("Negative counterexample: chadesh and chadash conflated");
}
const status=errors.length?"FAILED":"PASSED";
console.log("Judaica Design editorial checks:",status);
console.log("Built-in cases:",builtIn.length?"FAIL ("+builtIn.length+")":"PASS");
console.log("Nakdan merge cases:",nakdanMerge.length?"FAIL ("+nakdanMerge.length+")":"PASS");
console.log("Cross-genre/cross-nusach fixtures:",fixtures.cases.length);
console.log("Failed assertions:",errors.length);
console.log("Meteg/taam invariants:",fixtures.cases.length*2,"candidate checks");
for(const error of errors) console.error(error);
if(errors.length) process.exitCode=1;
