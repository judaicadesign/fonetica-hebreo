import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {extractEngine} from '../scripts/extract-engine.mjs';
const stub=`const document={getElementById(){return {value:'rabbinic',addEventListener(){},focus(){},select(){}}},createElement(){return {appendChild(){},addEventListener(){},replaceChildren(){}}}};const window={addEventListener(){}};const navigator={clipboard:{}};const requestAnimationFrame=f=>{};`;
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const api=vm.runInNewContext(stub+extractEngine(html)+';({rawTranslit,phonetize,clusters,shevaVocalized,REVIEWED_ARTSCROLL_VERSES});');
const report=JSON.parse(fs.readFileSync(new URL('../docs/SHEVA_COTEJO_20261012.json',import.meta.url),'utf8'));
assert.equal(report.previousPendingContexts,0);assert.equal(report.initialPendingContexts,28);assert.equal(report.confirmedVocalContexts,20);assert.equal(report.redundantContexts,1);
for(const row of report.decisions){
 for(const word of [row.word,row.word.normalize('NFD')]){
  assert.equal(api.rawTranslit(word),row.expectedRaw,row.ref+' structural reading');
  if(row.decision==='confirmed-vocal-by-ArtScroll-helper')for(const i of row.shevaIndices)assert.equal(api.shevaVocalized(api.clusters(word),i),true,row.ref+' independently observed helper index');
 }
 const contexts=api.REVIEWED_ARTSCROLL_VERSES.filter(v=>v.ref===row.ref);
 for(const context of contexts)for(const change of Object.values(context.changes))assert.ok(!change.reviewRequired&&!change.heldSilentSheva,'Resolved context '+row.ref+' cannot retain a hold');
}
const pending=[...new Set(api.REVIEWED_ARTSCROLL_VERSES.filter(v=>Object.values(v.changes).some(c=>c.reviewRequired)).map(v=>v.ref))].sort();
assert.deepEqual(pending,[...report.pendingRefs].sort());assert.equal(pending.length,7);
console.log('PASS visual audit: 20 observed vocal helpers derived structurally, 1 redundant hold removed, 7 honestly pending contexts');
