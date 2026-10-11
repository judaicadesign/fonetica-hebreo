/** Reproducible research backlog. Structural matches are candidates, not POS tags. */
import fs from 'node:fs';
import vm from 'node:vm';
import {extractEngine} from './extract-engine.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/legacy-rule-backlog.json',import.meta.url),'utf8'));
const retired=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/enu-rule-retired.json',import.meta.url),'utf8'));
const confirmed=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/user-confirmations-20261011.json',import.meta.url),'utf8'));
const confirmedKeys=new Set([...Object.keys(confirmed.readings),...confirmed.sentenceOnlyCapitals,...Object.keys(confirmed.editorialTerms)].map(s=>s.normalize('NFC')));
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>f();`;
const api=vm.runInNewContext(stub+extractEngine(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'))+';({clusters,rawTranslit,phoneWord,APPROVED,FINAL_FORMS,GOLDEN_EDITORIAL,GOLD});',{}, {timeout:20000});
const groups=new Map();
const latin=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
for(const entry of baseline.entries){
 if(!groups.has(entry.key))groups.set(entry.key,[]);
 groups.get(entry.key).push(entry);
}
const forms=[...groups].map(([key,entries])=>{
 const a=api.clusters(key),last=a.at(-1),prev=a.at(-2),before=a.at(-3);
 const has=(c,mark)=>!!c?.m.includes(mark);
 const families=[];
 if(/\s/.test(key))families.push('phrase');
 if(!/[\u05B0-\u05BB\u05C7]/.test(key))families.push('unpointed-or-abbreviation');
 if(a.length>1&&/[ולבכמשה]/.test(a[0].b))families.push('possible-prefix');
 if(last?.b==='ו'&&has(last,'\u05BC')&&prev?.b==='נ'&&has(before,'\u05B5'))families.push(before.b==='נ'?'enu-ambiguous-nun-stem':'enu-connecting-vowel');
 else if(last?.b==='ו'&&has(last,'\u05BC')&&prev?.b==='נ')families.push('other-nu');
 if(/[ךכ]/.test(last?.b||'')&&has(last,'\u05B8'))families.push('kha-suffix-candidate');
 if(last?.b==='ה'&&has(last,'\u05BC'))families.push('mappiq-he');
 if(last?.b==='ת'&&has(last,'\u05B8'))families.push('ta-verb-candidate');
 if(a.some(c=>has(c,'\u05B0')))families.push('sheva');
 if(a.some(c=>has(c,'\u05BC')))families.push('dagesh');
 if(a.some(c=>has(c,'\u05B8')))families.push('qamats-a-or-o');
 if(!families.length)families.push('other-lexical-or-stress');
 const raw=api.rawTranslit(key);
 const currentValues=[...['APPROVED','FINAL_FORMS','GOLDEN_EDITORIAL'].flatMap(table=>api[table].has(key)?[{table,value:api[table].get(key)}]:[]),
  ...(key in api.GOLD.sef.w?[{table:'GOLD.sef.w',value:api.GOLD.sef.w[key]}]:[])];
 const pronunciationDeltas=entries.map(e=>({table:e.table,value:e.value,
  kind:e.value===raw?'rule-equivalent':e.value.toLowerCase()===raw.toLowerCase()?'capitalization-only':latin(e.value)===latin(raw)?'stress-or-capitalization':'segmental-or-editorial',
  retired:!currentValues.some(v=>v.table===e.table)}));
 return {key,families,baselineRaw:entries[0].raw,currentRaw:raw,
  activeOutput:api.phoneWord(key,'',false,''),
  baselineTableDisagreement:new Set(entries.map(e=>e.value)).size>1,
  tableDisagreement:new Set(currentValues.map(e=>e.value)).size>1,currentValues,
  status:confirmedKeys.has(key)?'resolved-by-user-confirmation':retired.some(r=>r.key===key)?'retired-by-enu-rule':pronunciationDeltas.every(e=>e.retired)?'retired-by-rules':'pending-investigation',
  pronunciationDeltas};
});
const counts={};for(const f of forms)for(const family of f.families)counts[family]=(counts[family]||0)+1;
const tables=[...api.APPROVED.keys(),...api.FINAL_FORMS.keys(),...api.GOLDEN_EDITORIAL.keys(),...Object.keys(api.GOLD.sef.w)];
const report={baseline:baseline.baseline,baselineEntries:baseline.entries.length,baselineForms:forms.length,
 currentEntries:tables.length,currentForms:new Set(tables).size,
 retiredEntries:retired.length,retiredForms:new Set(retired.map(e=>e.key)).size,
 familyCounts:counts,tableDisagreements:forms.filter(f=>f.tableDisagreement).length,
 note:'Families overlap. Prefix/suffix candidates are not grammatical analyses. Pending does not mean a genuine exception. Compatibility fixtures are not independent pronunciation certification.',forms};
const target=process.argv[2]||'audit-results/rule-families.json';
fs.mkdirSync(new URL('../audit-results/',import.meta.url),{recursive:true});
fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,forms:undefined}));
