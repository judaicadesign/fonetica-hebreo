/* Clasificador conservador de alertas de acento en Tehilim.
 * Entrada: JSON de tests/tehilim-taam-audit.mjs --out
 * No etiqueta errores reales sin evidencia editorial independiente.
 */
import fs from "node:fs";
const input=process.argv[2],output=process.argv[3];
if(!input)throw Error("Uso: node tests/classify-tehilim-candidates.mjs auditoria.json [clasificacion.json]");
const report=JSON.parse(fs.readFileSync(input,"utf8"));
const forms=report.publishedCandidateForms||[];
const category=(form)=>{
 const examples=form.examples||[];
 const morph=String(form.category||"");
 const hebrew=String(form.hebrew||"");
 const taam=new Set(examples.map(e=>e.taam));
 const differentTargets=new Set(examples.map(e=>e.masoreticVowelIndex));
 const suffix=/ךָ|כֶם|כֶן|הֶם|הֶן|נוּ|נִי|נָה$/u.test(hebrew);
 const possibleSegolate=/^(Nc|N[cmpf])/u.test(morph);
 if(taam.has("U+5BD"))return ["revisar-meteg","La marca citada es meteg, no acento tónico"];
 if(differentTargets.size>1)return ["revisar-contexto","La misma grafía tiene más de una posición de taam en los ejemplos"];
 if(suffix)return ["revisar-sufijos","Comprobar acento morfológico del sufijo y prioridad de GOLD"];
 if(morph.startsWith("V"))return ["revisar-verbos","Comprobar forma verbal y contexto antes de alterar regla"];
 if(possibleSegolate)return ["revisar-sustantivos","Distinguir segolados y otras clases nominales"];
 return ["revisar-otros","Requiere contraste independiente"];
};
const buckets=new Map();
for(const f of forms){
 const [kind,reason]=category(f);
 const row={hebrew:f.hebrew,morphology:f.category,occurrences:f.occurrences,reason,examples:f.examples};
 if(!buckets.has(kind))buckets.set(kind,{occurrences:0,distinctForms:0,forms:[]});
 const b=buckets.get(kind);b.occurrences+=f.occurrences;b.distinctForms++;b.forms.push(row);
}
const total=forms.reduce((n,f)=>n+f.occurrences,0);
const classified=[...buckets].map(([kind,b])=>({kind,...b,forms:b.forms.sort((a,b)=>b.occurrences-a.occurrences)})).sort((a,b)=>b.occurrences-a.occurrences);
const result={
 source:input,generated:new Date().toISOString(),
 publishedCandidatesReported:report.counts?.publishedFlagged,
 classifiedOccurrences:total,
 discrepancy:report.counts?.publishedFlagged===total?null:"La suma no coincide: verificar si el informe está truncado",
 classificationStatus:"HIPÓTESIS DE TRIAGE, NO DICTAMEN EDITORIAL",
 confirmedEngineErrors:0,confirmedFalsePositives:0,
 note:"Cero significa que este programa no certifica casos; no que no existan errores.",
 categories:classified
};
if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({publishedCandidatesReported:result.publishedCandidatesReported,classifiedOccurrences:total,discrepancy:result.discrepancy,categories:classified.map(({kind,occurrences,distinctForms})=>({kind,occurrences,distinctForms}))},null,2));
if(result.discrepancy)process.exitCode=2;
