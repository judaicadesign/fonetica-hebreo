/* Judaica Design · auditoría de acentuación masorética (150 Tehilim).
 * Uso: node tests/tehilim-taam-audit.mjs [--xml /path/Ps.xml] [--out /path/report.json]
 *
 * Original work of the Open Scriptures Hebrew Bible available at
 * https://github.com/openscriptures/morphhb
 * OSHB morphology CC BY 4.0; underlying WLC Hebrew text public domain.
 * Revisión de candidatos, NO prueba de errores ni de precisión editorial.
 */
import fs from "node:fs/promises";
import crypto from "node:crypto";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const URL="https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/Ps.xml";
const PIN="2da40d4bfc7d1772eccb6f49cf027f460b8be4f4";
const argv=process.argv.slice(2);
const arg=k=>{const i=argv.indexOf(k);return i<0?null:argv[i+1];};

async function reference(){
  const local=arg("--xml");
  const content=local?await fs.readFile(local,"utf8"):await (async()=>{
    const res=await fetch(URL,{signal:AbortSignal.timeout(60000)});
    if(!res.ok)throw Error("OSHB HTTP "+res.status);
    return await res.text();
  })();
  const sha=crypto.createHash("sha1")
    .update("blob "+Buffer.byteLength(content,"utf8")+"\0")
    .update(content).digest("hex");
  if(sha!==PIN)throw Error("Cambió la versión de Ps.xml: "+sha+"; esperada "+PIN);
  return content;
}

async function engine(){
  const html=await fs.readFile(path.join(ROOT,"index.html"),"utf8");
  const start=html.lastIndexOf("<script>"),end=html.lastIndexOf("</script>");
  if(start<0||end<start)throw Error("Motor inline no encontrado");
  let s=html.slice(start+8,end);
  const anchor="  const pos = nuclei[target].pos;";
  if(s.split(anchor).length!==2)throw Error("Cambió stressAccent; revisar instrumentación");
  s=s.replace(anchor,
    "  CAPTURE.push({target,nuclei:nuclei.map(n=>({clusterIndex:n.clusterIndex,pos:n.pos}))});\n"+anchor
  );
  const setup=[
    "const CAPTURE=[];",
    "const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}},execCommand(){return true}};",
    "const window={addEventListener(){}};",
    "const navigator={clipboard:{writeText(){}}};",
    "const requestAnimationFrame=f=>f();"
  ].join("\n");
  return vm.runInNewContext(setup+s+
    "\n;({rawTranslit,wordOutput,runRegressionTests,reset:()=>CAPTURE.length=0,last:()=>CAPTURE.at(-1)});",
    {},{timeout:20000,filename:"index.html"});
}

function accents(raw){
  const word=raw.replaceAll("/",""),clusters=[];
  for(const c of word.normalize("NFD")){
    if(/[\u05d0-\u05ea]/u.test(c))clusters.push([]);
    else if(clusters.length)clusters.at(-1).push(c);
  }
  const marks=clusters.flatMap((cs,i)=>cs.filter(c=>/[\u0591-\u05af]/u.test(c))
    .map(c=>({clusterIndex:i,code:"U+"+c.codePointAt(0).toString(16).toUpperCase()})));
  const clean=word.normalize("NFD")
    .replace(/[\u0591-\u05af\u05bd]/gu,"").normalize("NFC");
  return {word,marks,clean};
}

async function main(){
  const [xml,api]=await Promise.all([reference(),engine()]);
  const verses=[...xml.matchAll(/<verse osisID="Ps\.(\d+)\.(\d+)">([\s\S]*?)<\/verse>/g)];
  const chapterCount=new Set(verses.map(v=>+v[1])).size;
  if(chapterCount!==150||verses.length<2500)throw Error("No contiene 150 Tehilim completos");
  // Prepositivos/postpositivos: no informan de manera confiable
  // la vocal tónica; algunos signos dobles requieren examen especial.
  const excluded=new Set(["U+5AD","U+59D","U+5AE"]);
  const totals={chapters:chapterCount,verses:verses.length,wordTokens:0,
    withoutTaam:0,multipleTaamim:0,nonLocalTaam:0,
    notInstrumented:0,unmappedTaam:0,comparable:0,
    agreement:0,flagged:0};
  const morphCounts=new Map(),formStress=new Map(),grouped=new Map();

  for(const v of verses){
    const chapter=+v[1],verse=+v[2];
    for(const w of v[3].matchAll(/<w ([^>]*)>([^<]*)<\/w>/g)){
      totals.wordTokens++;
      const p=accents(w[2]),morph=(w[1].match(/morph="([^"]+)"/)||[])[1]||"";
      if(!p.marks.length){totals.withoutTaam++;continue;}
      if(p.marks.length!==1){totals.multipleTaamim++;continue;}
      const mark=p.marks[0];
      if(excluded.has(mark.code)){totals.nonLocalTaam++;continue;}
      api.reset();
      const rawOutput=api.rawTranslit(p.word),result=api.last();
      if(!result){totals.notInstrumented++;continue;}
      const expected=result.nuclei.findIndex(n=>n.clusterIndex===mark.clusterIndex);
      if(expected<0){totals.unmappedTaam++;continue;}
      totals.comparable++;
      let f=formStress.get(p.clean);if(!f){f=new Map();formStress.set(p.clean,f);}
      f.set(expected,(f.get(expected)||0)+1);
      if(expected===result.target){totals.agreement++;continue;}
      totals.flagged++;
      const category=morph.split("/").at(-1).replace(/^H/,"").slice(0,3)||"other";
      morphCounts.set(category,(morphCounts.get(category)||0)+1);
      const key=p.clean+"|"+category;
      let item=grouped.get(key);
      if(!item){
        item={hebrew:p.clean,category,occurrences:0,examples:[]};
        grouped.set(key,item);
      }
      item.occurrences++;
      if(item.examples.length<3)item.examples.push({
        ref:chapter+":"+verse,morph,hebrew:p.clean,
        rawOutput,currentOutput:api.wordOutput(p.word),
        masoreticVowelIndex:expected,motorVowelIndex:result.target
      });
    }
  }

  const conflicts=[...formStress].filter(([w,m])=>m.size>1)
    .map(([word,m])=>({word,positions:[...m],occurrences:[...m.values()].reduce((a,b)=>a+b,0)}))
    .sort((a,b)=>b.occurrences-a.occurrences);
  const report={
    version:1,generated:new Date().toISOString(),
    source:{uri:URL,blobSha:PIN,
      attribution:"Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb"},
    caveat:"Candidatos a revisión: NO son errores verificados ni una tasa de exactitud del conversor.",
    method:"Compara el núcleo de un único taam local con el objetivo de acentuación de rawTranslit, no con toda la capa editorial de excepciones.",
    excludedAccents:[...excluded],counts:totals,
    flagRateAmongComparable:Math.round(totals.flagged/Math.max(1,totals.comparable)*1000)/10,
    distinctFlaggedForms:grouped.size,
    morphology:[...morphCounts].sort((a,b)=>b[1]-a[1]).slice(0,50),
    mostFrequent:[...grouped.values()].sort((a,b)=>b.occurrences-a.occurrences).slice(0,100),
    repeatedPointedFormDifferingAccent:conflicts.slice(0,100),
    regressions:api.runRegressionTests()
  };
  const target=arg("--out");
  if(target)await fs.writeFile(target,JSON.stringify(report,null,2)+"\n","utf8");
  console.log(JSON.stringify({
    wordTokens:totals.wordTokens,chapters:totals.chapters,
    comparable:totals.comparable,flagged:totals.flagged,
    flaggedPercent:report.flagRateAmongComparable,
    distinctFlaggedForms:report.distinctFlaggedForms,
    topMorphology:report.morphology.slice(0,12),
    samePointedFormDifferingAccent:conflicts.length,
    regressionFailures:report.regressions.length
  },null,2));
  if(report.regressions.length)process.exitCode=2;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
