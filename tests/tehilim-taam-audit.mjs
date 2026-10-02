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
  const chapterCounts=new Map(),accentDisagreements=new Map();
  totals.fullOutputOverrides=0; totals.overridesAmongFlagged=0;
  totals.publishedComparable=0;totals.publishedAgreement=0;
  totals.publishedFlagged=0;totals.publishedUnaligned=0;
  // El texto publicado se deriva de phonetize(), NO de wordOutput().
  const publishedFlags=new Map(),publishedMorphology=new Map();

  for(const v of verses){
    const chapter=+v[1],verse=+v[2];
    let chapterRow=chapterCounts.get(chapter);
    if(!chapterRow){chapterRow={chapter,words:0,comparable:0,flagged:0};chapterCounts.set(chapter,chapterRow);}
    for(const w of v[3].matchAll(/<w ([^>]*)>([^<]*)<\/w>/g)){
      totals.wordTokens++;chapterRow.words++;
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
      totals.comparable++;chapterRow.comparable++;
      const full=api.wordOutput(p.word);
      const published=api.phonetize(p.word);
      // Solo alineamos la acentuación si la forma fonética conserva
      // exactamente las letras del motor bruto (ignorando tildes
      // y capitalización); una forma GOLD que cambia sílabas queda fuera.
      const plain=t=>t.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036F]/g,"").normalize("NFC");
      const aligned=plain(published)===plain(rawOutput) &&
        result.nuclei.every(n=>!n.furtive);
      let publishedTarget=-1;
      if(aligned){
        const pos=published.search(/[áéíóú]/iu);
        if(pos>=0) publishedTarget=result.nuclei.findIndex(n=>n.pos===pos);
        else{
          const letters=published.replace(/['’\-]+$/g,"");
          const last=letters.at(-1)||"";
          publishedTarget= (/[aeiou]/i.test(last)||last==="n"||last==="s")
            ?result.nuclei.length-2:result.nuclei.length-1;
        }
      }
      if(!aligned || publishedTarget<0){
        totals.publishedUnaligned++;
      }else{
        totals.publishedComparable++;
        if(publishedTarget===expected){totals.publishedAgreement++;}
        else{
          totals.publishedFlagged++;
          const k=morph.split("/").at(-1).replace(/^H/,"").slice(0,3)||"other";
          publishedMorphology.set(k,(publishedMorphology.get(k)||0)+1);
          let e=publishedFlags.get(p.clean+"|"+k);
          if(!e){e={hebrew:p.clean,category:k,occurrences:0,examples:[]};publishedFlags.set(p.clean+"|"+k,e);}
          e.occurrences++;
          if(e.examples.length<3)e.examples.push({
            ref:chapter+":"+verse,masoreticVowelIndex:expected,
            finalVowelIndex:publishedTarget,finalPhonetic:published,
            rawOutput,morph,taam:mark.code
          });
        }
      }
      const overridden=full.toLowerCase()!==rawOutput.toLowerCase();
      if(overridden)totals.fullOutputOverrides++;
      let f=formStress.get(p.clean);if(!f){f=new Map();formStress.set(p.clean,f);}
      f.set(expected,(f.get(expected)||0)+1);
      if(expected===result.target){totals.agreement++;continue;}
      totals.flagged++;chapterRow.flagged++;
      if(overridden) totals.overridesAmongFlagged++;
      accentDisagreements.set(mark.code,(accentDisagreements.get(mark.code)||0)+1);
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
        rawOutput,currentOutput:full,editorialOverride:overridden,taamCode:mark.code,
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
    method:"Dos mediciones parciales: rawTranslit frente a taam; y phonetize aislado frente a taam solo cuando la cadena fonética admite alineación uno a uno con el motor bruto (ignorando tilde/capitalización). Ninguna equivale a validación editorial completa.",
    excludedAccents:[...excluded],counts:totals,
    flagRateAmongComparable:Math.round(totals.flagged/Math.max(1,totals.comparable)*1000)/10,
    distinctFlaggedForms:grouped.size,
    morphology:[...morphCounts].sort((a,b)=>b[1]-a[1]).slice(0,50),
    perChapter:[...chapterCounts.values()].sort((a,b)=>a.chapter-b.chapter),
    accentDisagreements:[...accentDisagreements].sort((a,b)=>b[1]-a[1]),
    allFlaggedForms:[...grouped.values()].sort((a,b)=>b.occurrences-a.occurrences),
    publishedCandidateMorphology:[...publishedMorphology].sort((a,b)=>b[1]-a[1]),
    publishedCandidateForms:[...publishedFlags.values()].sort((a,b)=>b.occurrences-a.occurrences),
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
    topFlagged:report.mostFrequent.slice(0,18),
    mostFlaggedChapters:report.perChapter.filter(c=>c.flagged).sort((a,b)=>b.flagged-a.flagged).slice(0,12),
    publishedComparable:totals.publishedComparable,
    publishedAgreement:totals.publishedAgreement,
    publishedFlagged:totals.publishedFlagged,
    publishedUnaligned:totals.publishedUnaligned,
    publishedCandidateMorphology:report.publishedCandidateMorphology.slice(0,10),
    topPublishedCandidates:report.publishedCandidateForms.slice(0,12),
    fullOutputOverrides:totals.fullOutputOverrides,
    overridesAmongFlagged:totals.overridesAmongFlagged,
    samePointedFormDifferingAccent:conflicts.length,
    regressionFailures:report.regressions.length
  },null,2));
  if(report.regressions.length)process.exitCode=2;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
